import * as React from 'react';
import { cn } from '../../lib/utils';

const Table = ({ className, ...props }) => (
  <div className='w-full overflow-auto'>
    <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
);
const TableHeader = (props) => <thead className='[&_tr]:border-b' {...props} />;
const TableBody = (props) => <tbody className='[&_tr:last-child]:border-0' {...props} />;
const TableFooter = (props) => <tfoot className='bg-muted/50 font-medium' {...props} />;
const TableRow = ({ className, ...props }) => (
  <tr className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)} {...props} />
);
const TableHead = ({ className, ...props }) => (
  <th
    className={cn(
      'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 select-none',
      className
    )}
    {...props}
  />
);
const TableCell = ({ className, ...props }) => (
  <td className={cn('p-2 align-middle [&:has([role=checkbox])]:pr-0', className)} {...props} />
);
const TableCaption = ({ className, ...props }) => (
  <caption className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
);

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
