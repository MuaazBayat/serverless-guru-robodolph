"use client";

import { List, ListItem as MTListItem, Card, Typography } from "@material-tailwind/react";

type ListItem = {
  key: string;
  value: string;
}

interface ListDefaultProps {
  listItems?: ListItem[]; // listItems is optional and can be undefined
}

export function ListDefault({ listItems = [] }: ListDefaultProps) { // Default to an empty array if not provided
  // Guard clause to ensure listItems is an array
  if (!Array.isArray(listItems)) {
    console.error('ListDefault component expects listItems to be an array', listItems);
    return null; // or return an appropriate fallback UI
  }

  return (
    <Card className="w-full">
      <List>
        {listItems.map((item, index) => (
          <MTListItem key={index}> 
            <div>
              <Typography variant="h6" color="blue-gray">
                {item.key}
              </Typography>
              <Typography variant="small" color="gray" className="font-normal">
                {item.value}
              </Typography>
            </div>
          </MTListItem>
        ))}
      </List>
    </Card>
  );
}
