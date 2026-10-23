import { dashboardAccount } from "@/lib/account/dashboard";
import { SavedQrLibrary } from "@/components/account/saved-qr-library";
import { StorageCard } from "@/components/account/storage-card";
import styles from "@/components/account/dashboard.module.css";
export const metadata = { title: "My QR Codes" };
export default async function SavedQrPage() {
  const account = await dashboardAccount();
  return <><div className={styles.pageHeading}><h1>My QR Codes</h1><p>Save your content and design, then edit and export it again. Editing a saved design does not change already downloaded static QR codes.</p></div><SavedQrLibrary pro={account.access.pro} /><StorageCard /></>;
}
