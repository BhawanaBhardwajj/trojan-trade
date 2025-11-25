import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useEffect } from "react";
import * as amplitude from '@amplitude/analytics-browser';
import { sessionReplayPlugin } from '@amplitude/plugin-session-replay-browser';
import Index from "./pages/Index";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import PostAdPage from "./pages/PostAdPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import ProfileSetupPage from "./pages/ProfileSetupPage";
import AuthCallback from "./pages/AuthCallback";
import { ProtectedRoute } from "./components/ProtectedRoute";
import GameDayPage from "./pages/GameDayPage";
import MerchandisePage from "./pages/MerchandisePage";
import RentalsPage from "./pages/RentalsPage";
import FurniturePage from "./pages/FurniturePage";
import MyListingsPage from "./pages/MyListingsPage";
import MessagesPage from "./pages/MessagesPage";
import SearchPage from "./pages/SearchPage";
import NotFound from "./pages/NotFound";
import SafetyPage from "./pages/SafetyPage";
import GuidelinesPage from "./pages/GuidelinesPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import CareersPage from "./pages/CareersPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import SellerProfilePage from "./pages/SellerProfilePage";

const queryClient = new QueryClient();

const App = () => {
  // Initialize Amplitude Analytics with Session Replay on mount
  useEffect(() => {
    amplitude.add(sessionReplayPlugin({sampleRate: 1}));
    amplitude.init('e2d1465b946fbf5d408e21f8fd2756f2', {"autocapture":true});
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/category/game-day" element={<GameDayPage />} />
            <Route path="/category/merchandise" element={<MerchandisePage />} />
            <Route path="/category/rentals" element={<RentalsPage />} />
            <Route path="/category/furniture" element={<FurniturePage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/listing/:id" element={<ProductPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/post-ad" element={<ProtectedRoute><PostAdPage /></ProtectedRoute>} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
            <Route path="/profile-setup" element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} />
            <Route path="/my-listings" element={<ProtectedRoute><MyListingsPage /></ProtectedRoute>} />
            <Route path="/messages" element={<ProtectedRoute><MessagesPage /></ProtectedRoute>} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/safety" element={<SafetyPage />} />
            <Route path="/guidelines" element={<GuidelinesPage />} />
            <Route path="/how-it-works" element={<HowItWorksPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/u/:sellerId" element={<SellerProfilePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;