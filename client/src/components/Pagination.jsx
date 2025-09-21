import React from "react";
import { Button } from "./UI";

export default function Pagination({ page, onPage, hasNext }) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        onClick={() => onPage(Math.max(1, page - 1))}
        disabled={page <= 1}
      >
        Prev
      </Button>
      <span className="text-sm">Page {page}</span>
      <Button
        variant="secondary"
        onClick={() => onPage(page + 1)}
        disabled={!hasNext}
      >
        Next
      </Button>
    </div>
  );
}
