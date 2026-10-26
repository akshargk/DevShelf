const bcrypt = require('bcryptjs');
const prisma = require('./config/db');
const connectMongo = require('./config/mongo');
const SnippetRevision = require('./models/SnippetRevision');

const demoSnippets = [
  {
    title: 'Java HashMap Initialization',
    language: 'java',
    description: 'Basic HashMap initialization and iterating key-value pairs in Java.',
    code: `import java.util.HashMap;
import java.util.Map;

public class Main {
    public static void main(String[] args) {
        Map<String, Integer> scoreMap = new HashMap<>();
        scoreMap.put("Alice", 95);
        scoreMap.put("Bob", 88);

        for (Map.Entry<String, Integer> entry : scoreMap.entrySet()) {
            System.out.println(entry.getKey() + ": " + entry.getValue());
        }
    }
}`,
    tags: ['java', 'collections', 'hashmap'],
    isFavorite: true,
  },
  {
    title: 'SQL Inner Join with Aggregation',
    language: 'sql',
    description: 'Relational query joining users and orders with total spending aggregation.',
    code: `SELECT 
    u.id AS user_id,
    u.name,
    COUNT(o.id) AS total_orders,
    COALESCE(SUM(o.amount), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id, u.name
HAVING COUNT(o.id) > 0
ORDER BY total_spent DESC;`,
    tags: ['sql', 'database', 'join', 'aggregation'],
    isFavorite: false,
  },
  {
    title: 'React Custom Debounce Hook',
    language: 'javascript',
    description: 'Delays updating value until user stops typing for specified delay.',
    code: `import { useState, useEffect } from 'react';

export function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}`,
    tags: ['react', 'hooks', 'performance', 'javascript'],
    isFavorite: true,
  },
  {
    title: 'Python Binary Search',
    language: 'python',
    description: 'O(log N) iterative binary search on a sorted list.',
    code: `def binary_search(arr: list[int], target: int) -> int:
    left, right = 0, len(arr) - 1
    
    while left <= right:
        mid = left + (right - left) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
            
    return -1`,
    tags: ['python', 'algorithms', 'binarysearch'],
    isFavorite: true,
  },
  {
    title: 'Express JWT Authorization Middleware',
    language: 'javascript',
    description: 'Verifies bearer token and attaches decoded user to request.',
    code: `const jwt = require('jsonwebtoken');

const verifyAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const token = header.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Forbidden' });
    }
};`,
    tags: ['node', 'express', 'auth', 'jwt'],
    isFavorite: false,
  },
  {
    title: 'TypeScript Safe Result Monad',
    language: 'typescript',
    description: 'Type-safe error handling pattern avoiding try-catch boilerplate in TypeScript.',
    code: `export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

export async function tryCatch<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const data = await promise;
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error : new Error(String(error))
    };
  }
}`,
    tags: ['typescript', 'error-handling', 'types', 'patterns'],
    isFavorite: true,
  },
  {
    title: 'Docker Multi-Stage Production Build',
    language: 'docker',
    description: 'Optimized minimal production Docker container for Node.js Express microservices.',
    code: `# Stage 1: Build & Dependencies
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Minimal Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY . .
EXPOSE 5000
USER node
CMD ["node", "server.js"]`,
    tags: ['docker', 'devops', 'node', 'containers'],
    isFavorite: false,
  },
];

async function seed() {
  console.log('Seeding DevShelf database...');
  await connectMongo();

  // Create or verify demo user
  const email = 'alex@example.com';
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('password123', salt);

  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Alex Developer',
        email,
        password: hashedPassword,
      },
    });
    console.log(`[Seed] Created demo user: ${user.email} (password: password123)`);
  } else {
    // Ensure password is reset to password123 in case it was modified
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    console.log(`[Seed] Verified demo user: ${user.email} (password: password123)`);
  }

  // Idempotently create demo snippets
  for (const item of demoSnippets) {
    const existingSnippet = await prisma.snippet.findFirst({
      where: { userId: user.id, title: item.title },
    });

    if (!existingSnippet) {
      const tagConnect = item.tags.map((t) => ({
        where: { name: t },
        create: { name: t },
      }));

      const snippet = await prisma.snippet.create({
        data: {
          userId: user.id,
          title: item.title,
          language: item.language,
          description: item.description,
          code: item.code,
          isFavorite: item.isFavorite,
          tags: {
            connectOrCreate: tagConnect,
          },
        },
        include: { tags: true },
      });

      // Module 3: Initial revision in MongoDB (graceful if MongoDB is offline)
      try {
        await SnippetRevision.create({
          snippetId: snippet.id,
          version: 1,
          title: snippet.title,
          code: snippet.code,
          language: snippet.language,
          description: snippet.description,
          tags: snippet.tags.map((t) => t.name),
          changedAt: new Date(),
          changeNote: 'Initial seeded snippet version',
        });
        console.log(`[Seed] Created snippet: "${snippet.title}" + MongoDB revision`);
      } catch (mongoErr) {
        console.log(`[Seed] Created snippet: "${snippet.title}" in PostgreSQL (MongoDB revision skipped)`);
      }
    } else {
      console.log(`[Seed] Snippet already exists: "${item.title}"`);
    }
  }

  console.log('Seeding complete! You can now log in with alex@example.com / password123');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
