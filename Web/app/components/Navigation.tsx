"use client";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { createClient } from "@/utils/supabase/client";
import { User } from '@supabase/supabase-js';
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
  Navbar,
  Collapse,
  IconButton,
} from "@material-tailwind/react";
import {
  ChartBarSquareIcon,
  EnvelopeOpenIcon,
  SwatchIcon,
  PowerIcon,
  CogIcon
} from "@heroicons/react/24/solid";



type NavbarItem = {
  name: string;
  path: string;
  icon: keyof typeof IconMap;
};

const IconMap = {
  ChartBarSquareIcon: ChartBarSquareIcon,
  EnvelopeOpenIcon: EnvelopeOpenIcon,
  SwatchIcon: SwatchIcon,
  CogIcon: CogIcon,
};

interface DefaultSidebarProps {
  //appName: string;
  logoUrl: string;
}

export function DefaultSidebar({ logoUrl }: DefaultSidebarProps) {
  const navbarItems: NavbarItem[] = [
    { name: "Jobs", path: "/jobs", icon: "EnvelopeOpenIcon" },
  ];
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user ?? null); // Set user or null if user is undefined
  };

  return (
    <Card className="h-screen w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Link href="/">
          
          <img src={logoUrl}/>
        </Link>
      </div>
      <List>
        {navbarItems.map(item => (
          <Link key={item.name} href={item.path}>
            <ListItem>
              <ListItemPrefix>
                {React.createElement(IconMap[item.icon], { className: "h-5 w-5" })}
              </ListItemPrefix>
              {item.name}
            </ListItem>
          </Link>
        ))}
      </List>
      <footer className="flex w-full flex-row flex-wrap items-end justify-center gap-y-6 gap-x-12 border-t border-blue-gray-50 py-6 text-center md:justify-between">
      <Link href="https://www.nineteen58.co.za/">
        <Typography color="blue-gray" className="font-normal">
          &copy; Robodolph
        </Typography>
      </Link>
      </footer>
    </Card>
  );
}



function NavList() {
  return (
    <ul className="my-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href="#" className="flex items-center hover:text-blue-500 transition-colors">
          Pages
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href="#" className="flex items-center hover:text-blue-500 transition-colors">
          Account
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href="#" className="flex items-center hover:text-blue-500 transition-colors">
          Blocks
        </a>
      </Typography>
      <Typography
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-medium"
      >
        <a href="#" className="flex items-center hover:text-blue-500 transition-colors">
          Docs
        </a>
      </Typography>
    </ul>
  );
}

export function NavbarSimple() {
  const [openNav, setOpenNav] = React.useState(false);

  const handleWindowResize = () =>
    window.innerWidth >= 960 && setOpenNav(false);

  React.useEffect(() => {
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  return (
    <Navbar className="mx-auto max-w-screen-xl px-6 py-3">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          as="a"
          href="#"
          variant="h6"
          className="mr-4 cursor-pointer py-1.5"
        >
          Material Tailwind
        </Typography>
        <div className="hidden lg:block">
          <NavList />
        </div>
        <IconButton
          variant="text"
          className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
          ripple={false}
          onClick={() => setOpenNav(!openNav)}
        >
          {openNav ? (
            <XMarkIcon className="h-6 w-6" strokeWidth={2} />
          ) : (
            <Bars3Icon className="h-6 w-6" strokeWidth={2} />
          )}
        </IconButton>
      </div>
      <Collapse open={openNav}>
        <NavList />
      </Collapse>
    </Navbar>
  );
}