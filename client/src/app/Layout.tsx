import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../widjets/Navigation';
import Footer from '../widjets/Footer';
import './Layout.css';

type LayoutProps = {
  user: unknown;
  setUser: (user: unknown) => void;
};

export default function Layout({ user, setUser }: LayoutProps) {
  return (
    <div className="app">
      <Navigation user={user} setUser={setUser} />
      <main className="main">
        <Outlet context={{ user, setUser }} />
      </main>
      <Footer />
    </div>
  );
}