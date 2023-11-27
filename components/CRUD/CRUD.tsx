import {
  Sheet,
  SheetTrigger,
  SheetDescription,
  SheetContent,
  SheetTitle,
  SheetHeader,
} from "../ui/sheet";

export const CRUD = ({
  open,
  title,
  description,
  children,
}: {
  children: JSX.Element;
  title?: string;
  description?: string;
  open: boolean;
}) => {
  return (
    <Sheet open={open}>
      <SheetTrigger>Open</SheetTrigger>
      <SheetContent className="min-w-[600px]">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
};
