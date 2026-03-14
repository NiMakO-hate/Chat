import React, { ReactNode } from 'react';
import { UsersList } from '../widjets/UsersList';
import './ChatLayout.css';

type ChatLayoutProps = {
  rightPane: ReactNode;
};

export function ChatLayout({ rightPane }: ChatLayoutProps) {
  return (
    <div className="chat-layout">
      <aside className="chat-layout__sidebar">
        <UsersList />
      </aside>
      <main className="chat-layout__main">{rightPane}</main>
    </div>
  );
}

