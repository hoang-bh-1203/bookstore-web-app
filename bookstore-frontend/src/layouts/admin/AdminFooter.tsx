export default function AdminFooter() {
  return (
    <footer className="text-center p-4 bg-muted border-t">
      <p className="text-sm text-muted-foreground">
        Admin Panel ©{new Date().getFullYear()} - Được phát triển bởi Your
        Company
      </p>
    </footer>
  );
}
