import { useState, useEffect } from "react";
import { useNavigate, Outlet, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LayoutDashboard, 
  Newspaper, 
  Image, 
  Megaphone, 
  LogOut, 
  Menu, 
  X,
  Home,
  ChevronDown,
  Bell,
  Search,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import logoSmansa from "@/assets/logo-smansa.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Berita", href: "/admin/berita", icon: Newspaper },
  { label: "Galeri", href: "/admin/galeri", icon: Image },
  { label: "Pengumuman", href: "/admin/pengumuman", icon: Megaphone },
];

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAdmin, isLoading, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (!isLoading && user && !isAdmin) {
      navigate("/");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--admin-sidebar))]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 border-4 border-[hsl(var(--admin-primary))] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-muted-foreground">Memuat...</span>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--admin-sidebar))]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-card border-b border-border px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoSmansa} alt="Logo" className="h-8 w-auto" />
            <span className="font-semibold text-foreground">Admin Panel</span>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 shadow-lg lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          sidebarCollapsed ? "w-20" : "w-[270px]"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-[70px] flex items-center gap-3 px-5 border-b border-border bg-gradient-to-r from-[hsl(var(--admin-primary))] to-[hsl(var(--admin-primary-light))]">
          <img src={logoSmansa} alt="Logo" className="h-10 w-10 rounded-lg bg-white/10 p-1" />
          {!sidebarCollapsed && (
            <div className="overflow-hidden">
              <h1 className="font-bold text-white leading-tight truncate">SMANSA</h1>
              <p className="text-xs text-white/70 truncate">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Menu Label */}
        {!sidebarCollapsed && (
          <div className="px-6 pt-6 pb-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Menu Utama</span>
          </div>
        )}

        {/* Navigation */}
        <nav className={cn("px-4 py-2 space-y-1", sidebarCollapsed && "px-2")}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive
                    ? "bg-[hsl(var(--admin-primary))] text-white shadow-lg shadow-[hsl(var(--admin-primary))]/30"
                    : "text-muted-foreground hover:bg-[hsl(var(--admin-sidebar))] hover:text-foreground",
                  sidebarCollapsed && "justify-center px-3"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5 transition-transform group-hover:scale-110",
                  isActive && "text-white"
                )} />
                {!sidebarCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="my-4 mx-4 border-t border-border"></div>

        {/* Quick Links Label */}
        {!sidebarCollapsed && (
          <div className="px-6 pb-2">
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Akses Cepat</span>
          </div>
        )}

        {/* Quick Links */}
        <nav className={cn("px-4 space-y-1", sidebarCollapsed && "px-2")}>
          <Link
            to="/"
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-muted-foreground hover:bg-[hsl(var(--admin-sidebar))] hover:text-foreground transition-all duration-200",
              sidebarCollapsed && "justify-center px-3"
            )}
          >
            <Home className="h-5 w-5" />
            {!sidebarCollapsed && <span>Lihat Website</span>}
          </Link>
        </nav>

        {/* User Profile Section - Bottom */}
        <div className={cn(
          "absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card",
          sidebarCollapsed && "p-2"
        )}>
          {!sidebarCollapsed ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[hsl(var(--admin-sidebar))] transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-[hsl(var(--admin-primary))] text-white font-semibold">
                      {user?.email?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left overflow-hidden">
                    <p className="text-sm font-medium text-foreground truncate">Administrator</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className={cn(
        "min-h-screen pt-16 lg:pt-0 transition-all duration-300",
        sidebarCollapsed ? "lg:ml-20" : "lg:ml-[270px]"
      )}>
        {/* Top Header Bar */}
        <header className="hidden lg:flex h-[70px] items-center justify-between px-6 bg-card border-b border-border sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="rounded-xl hover:bg-[hsl(var(--admin-sidebar))]"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Cari..." 
                className="w-64 pl-10 bg-[hsl(var(--admin-sidebar))] border-0 rounded-xl focus-visible:ring-[hsl(var(--admin-primary))]" 
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-[hsl(var(--admin-sidebar))] relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-[hsl(var(--admin-danger))] rounded-full"></span>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-xl hover:bg-[hsl(var(--admin-sidebar))] gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-[hsl(var(--admin-primary))] text-white text-sm font-semibold">
                      {user?.email?.charAt(0).toUpperCase() || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">Admin</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}