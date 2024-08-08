import { Elysia } from 'elysia';

// Initialize Elysia server
const app = new Elysia();

// Define routes with mock responses
app.post('/secret', (req: any, res: any) => {
  res.status(200).json({ message: 'Secret added successfully' });
});

app.get('/secret/:hash', (req: any, res: any) => {
  res.status(200).json({ message: 'Secret retrieved successfully' });
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
