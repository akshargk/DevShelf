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
];

async function seed() {
  console.log('Seeding DevShelf database...');
  await connectMongo();

  // Create demo user
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
    console.log(`[Seed] Demo user already exists: ${user.email}`);
  }

  // Create demo snippets if user has none
  const count = await prisma.snippet.count({ where: { userId: user.id } });
  if (count === 0) {
    for (const item of demoSnippets) {
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

      // Module 3: Initial revision in MongoDB
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
      console.log(`[Seed] Created snippet: "${snippet.title}" with initial MongoDB revision`);
    }
  } else {
    console.log(`[Seed] User already has ${count} snippets.`);
  }

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('[Seed Error]', err);
  process.exit(1);
});
