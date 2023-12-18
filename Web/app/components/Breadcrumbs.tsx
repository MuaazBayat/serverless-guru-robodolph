"use client"

import { Breadcrumbs } from "@material-tailwind/react";

type breadcrumbsDetail = {
    href: string;
    label: string;
}
 
export function BreadcrumbsDefault() {

    const breadcrumb = [
        {"href": "/account", "label": "Breadcrumbs"}
    ]
  return (
    <Breadcrumbs>
      <a href="#" className="opacity-60">
        Docs
      </a>
      <a href="#" className="opacity-60">
        Components
      </a>
      <a href="#">Breadcrumbs</a>
    </Breadcrumbs>
  );
}