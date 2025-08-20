import { Top } from 'main/Top/Top';
import { Footer } from 'main/Footer/Footer';
import { Routes } from 'main/Routes/Routes';
import { useUserCheck } from 'hooks/auth';

export const Main = () => {
  useUserCheck();

  return (
    <>
      <Top />
        <Routes />
      <Footer />
    </>
  );
};
