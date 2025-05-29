"use client";
import React from "react";
import { IconHome, IconMessage, IconUser, IconLogout, IconLogin } from "@tabler/icons-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

interface NavItem {
  name: string;
  link: string;
  icon: React.ReactNode;
}

export function FloatingNav() {
  const { data: session } = useSession();

  const navItems: NavItem[] = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-8 w-8 text-neutral-500 dark:text-white" />,
    },
    ...(session ? [
      {
        name: "Dashboard",
        link: "/dashboard",
        icon: <IconUser className="h-8 w-8 text-neutral-500 dark:text-white" />,
      },
      {
        name: "Messages",
        link: "/messages",
        icon: <IconMessage className="h-8 w-8 text-neutral-500 dark:text-white" />,
      },
      {
        name: "Logout",
        link: "#",
        icon: <IconLogout className="h-8 w-8 text-neutral-500 dark:text-white" />,
      },
    ] : [
      {
        name: "Login",
        link: "/sign-in",
        icon: <IconLogin className="h-8 w-8 text-neutral-500 dark:text-white" />,
      },
    ]),
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 mb-6">
      <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-8 py-5 rounded-full border border-white/20">
        {navItems.map((item) => (
          item.name === "Logout" ? (
            <button
              key={item.name}
              onClick={handleLogout}
              className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors"
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </button>
          ) : (
            <Link
              key={item.name}
              href={item.link}
              className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors"
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </Link>
          )
        ))}
      </div>
    </nav>
  );
}

export function FloatingNavDemo() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  return (
    <div className="relative  w-full">
      <FloatingNav />
      <DummyContent />
    </div>
  );
}
const DummyContent = () => {
  return (
    <div className="grid grid-cols-1 h-[40rem] w-full bg-white dark:bg-black relative border border-neutral-200 dark:border-white/[0.2] rounded-md">
      <p className="dark:text-white text-neutral-600 text-center text-4xl mt-40 font-bold">
        Scroll back up to reveal Navbar
      </p>
      <div className="inset-0 absolute bg-grid-black/[0.1] dark:bg-grid-white/[0.2]" />
    </div>
  );
};
