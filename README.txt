Cara upload ke GitHub Pages:
1. Buat repository baru (public atau private).
2. Unggah semua file di dalam zip ini ke root repo (index.html, manifest.json, service-worker.js, folder icons).
   - Jika menggunakan GitHub mobile, pilih 'Add file' -> 'Upload files' lalu pilih file hasil ekstrak.
3. Aktifkan GitHub Pages: Settings -> Pages -> Source: Deploy from a branch -> pilih branch main dan folder root -> Save.
4. Setelah deploy selesai, buka URL: https://<username>.github.io/<repo-name>/ 
5. Untuk instalasi PWA di Android: buka URL tersebut di Chrome mobile -> Menu -> 'Add to Home screen'.
Catatan: service-worker.js diasumsikan berada pada root; pastikan file tetap di root saat diupload.
