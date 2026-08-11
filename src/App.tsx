import { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router-dom';
import { AIChat } from '@/components/ai/AIChat';
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Sidebar } from '@/components/Sidebar';
import { AI_CONFIG_ITEM } from '@/data/navigation';
import { useAuthBootstrap } from '@/hooks/useAuthBootstrap';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import ExamSession from '@/pages/ExamSession';
import Exams from '@/pages/Exams';
import Flashcards from '@/pages/Flashcards';
import AIConfig from '@/pages/AIConfig';
import LearningPath from '@/pages/LearningPath';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';

function AppShell() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const openMenu = useCallback(() => setIsMenuOpen(true), []);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  return (
    <div className="min-h-screen bg-surface dark:bg-navy-dark">
      <Sidebar open={isMenuOpen} onClose={closeMenu} />
      <div className="flex min-h-screen flex-col lg:pl-72">
        <Navbar onOpenMenu={openMenu} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:p-8">
          <div className="mx-auto w-full max-w-5xl">
            <Outlet />
          </div>
        </main>
      </div>
      <AIChat />
    </div>
  );
}

export default function App() {
  useAuthBootstrap();
  const status = useAuthStore((state) => state.status);
  const setThemeMode = useThemeStore((state) => state.setMode);

  useEffect(() => {
    setThemeMode(useThemeStore.getState().mode);
  }, [setThemeMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            status === 'authenticated' ? <Navigate to="/" replace /> : <Login />
          }
        />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="examenes" element={<Exams />} />
            <Route path="examenes/:examId" element={<ExamSession />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="ruta-aprendizaje" element={<LearningPath />} />
            <Route
              path={AI_CONFIG_ITEM.path.slice(1)}
              element={<AIConfig />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
