// frontend/src/context/AuthProviderStub.tsx
import type { ReactNode } from 'react';

interface AuthProviderStubProps {
  children: ReactNode;
}

const AuthProviderStub: React.FC<AuthProviderStubProps> = ({ children }) => {
  return <>{children}</>;
};

export default AuthProviderStub;
