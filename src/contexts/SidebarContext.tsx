import React, { FC, useState, createContext, ReactNode } from 'react';

// Định nghĩa kiểu cho SidebarContext
type SidebarContext = {
  sidebarToggle: boolean;
  toggleSidebar: () => void;
  closeSidebar: () => void;
};

// Tạo context với giá trị mặc định
export const SidebarContext = createContext<SidebarContext>({} as SidebarContext);

// Định nghĩa kiểu cho props bao gồm children
interface SidebarProviderProps {
  children: ReactNode; // Định nghĩa children
}

// SidebarProvider component
export const SidebarProvider: FC<SidebarProviderProps> = ({ children }) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);

  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };

  const closeSidebar = () => {
    setSidebarToggle(false);
  };

  return (
    <SidebarContext.Provider value={{ sidebarToggle, toggleSidebar, closeSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
