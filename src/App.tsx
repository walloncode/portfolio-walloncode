import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Layout } from "@/components/Layout";
import { Home } from "@/pages/Home";
import { NotFound } from "@/pages/NotFound";
import { ScrollToTop } from "@/components/ScrollToTop";

const ProjectPage = lazy(() =>
  import("@/pages/projects/ProjectPage").then((m) => ({ default: m.ProjectPage })),
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/projects/:slug"
                element={
                  <Suspense fallback={null}>
                    <ProjectPage />
                  </Suspense>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
