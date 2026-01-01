const HASH_CONFIG = { logN: 15, r: 8, p: 1 };

interface ScryptModule {
  default: {
    kdf: (password: string, config: typeof HASH_CONFIG) => Promise<Uint8Array>;
    verify: (hash: Uint8Array, password: string) => Promise<boolean>;
  };
}

export async function hashPassword(password: string): Promise<string> {
  const module = (await import('scrypt-kdf')) as unknown as ScryptModule;
  const Scrypt = module.default;
  const hash = await Scrypt.kdf(password, HASH_CONFIG);
  return Buffer.from(hash).toString('base64');
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const module = (await import('scrypt-kdf')) as unknown as ScryptModule;
  const Scrypt = module.default;
  const hashBuffer = Buffer.from(storedHash, 'base64');
  return Scrypt.verify(hashBuffer, password);
}
