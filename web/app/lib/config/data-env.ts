import { ensureServerSide } from './env';

ensureServerSide();

export function getDataEnv(): 'dev' | 'prod' {
  const value = process.env.DATA_ENV?.trim().toLowerCase();
  if (value === 'dev' || value === 'prod') {
    return value;
  }
  return 'prod';
}
