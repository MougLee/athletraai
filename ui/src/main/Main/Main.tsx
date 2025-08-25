import { Top } from 'main/Top/Top';
import { Footer } from 'main/Footer/Footer';
import { Routes } from 'main/Routes/Routes';
import { useAuth } from 'hooks/auth';

export const Main = () => {
  // This ensures authentication is checked globally
  useAuth();

  return (
    <>
      <Top />
        <Routes />
      <Footer />
    </>
  );
};
