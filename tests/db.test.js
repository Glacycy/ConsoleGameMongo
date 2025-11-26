const { connect, disconnect, getDb } = require('../src/db');

describe('Database Connection', () => {
  afterEach(async () => {
    await disconnect();
  });

  it('should connect to MongoDB', async () => {
    const db = await connect();
    expect(db).toBeDefined();
    expect(db.databaseName).toBe('consolegame');
  });

  it('should return same db instance on multiple connect calls', async () => {
    const db1 = await connect();
    const db2 = await connect();
    expect(db1).toBe(db2);
  });

  it('should disconnect from MongoDB', async () => {
    await connect();
    await disconnect();
    expect(() => getDb()).toThrow('Database not connected. Call connect() first.');
  });

  it('should throw error when getDb is called without connection', () => {
    expect(() => getDb()).toThrow('Database not connected. Call connect() first.');
  });

  it('should allow reconnection after disconnect', async () => {
    await connect();
    await disconnect();
    const db = await connect();
    expect(db).toBeDefined();
    expect(db.databaseName).toBe('consolegame');
  });
});
