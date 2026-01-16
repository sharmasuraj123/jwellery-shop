import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { User, LogOut } from "lucide-react";

export default function Navbar({ onLoginClick }) {
  const { user, logout } = useAuth();

  return (
    <nav className="glass-nav " data-testid="navbar">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          <Link
            to="/"
            className="text-2xl font-bold text-[#832728]"
            style={{ fontFamily: "Playfair Display, serif" }}
            data-testid="nav-logo"
          >
            Janki Jewellery
          </Link>

          <div className="flex items-center gap-6">
            {user ? (
              <>
                <div
                  className="flex items-center gap-3"
                  data-testid="user-info"
                >
                  {user.picture && (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
                {user.is_admin && (
                  <Link to="/admin" data-testid="nav-admin-link">
                    <Button variant="outline" size="sm" className="border-[#832728] text-[#832728] hover:bg-[#832728] hover:text-white"
>
                      Admin
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="border-[#832728] text-[#832728] hover:bg-[#832728] hover:text-white"

                  data-testid="btn-logout"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button
                onClick={onLoginClick}
                variant="outline"
                data-testid="nav-login-btn"
                className="border-[#832728] text-[#832728] hover:bg-[#832728] hover:text-white"

              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
