import server from './server';
import detectPort from 'detect-port';

async function main() {
  const port = await detectPort(3001);

  server.listen(port, () => {
    console.clear();
    console.log(`server is running on port ${port}`);
  });
}

void main();
