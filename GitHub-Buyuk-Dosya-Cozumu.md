# GitHub'daki Büyük Dosya Sorunu İçin Çözüm

GitHub'a yüklemeye çalıştığınız projede, dosya boyutu sınırlarını aşan büyük zip dosyaları var:
- `atil.zip` (162.69 MB)
- `dolunay-site-update.zip` (162.85 MB)

GitHub dosya boyutu sınırı 100MB olduğu için bu dosyaları push edemiyorsunuz.

## Bu Sorunu Çözmek İçin Yapmanız Gerekenler

1. Büyük dosyaları `.gitignore` dosyasına ekleyin (bu adımı zaten tamamladık).

2. Git geçmişinden büyük dosyaları tamamen kaldırmak için şu komutları sırasıyla çalıştırın:

```bash
# Git'ten büyük dosyaları tamamen kaldırma
git filter-branch --force --index-filter "git rm --cached --ignore-unmatch *.zip" --prune-empty --tag-name-filter cat -- --all

# Git önbelleğini temizleme
git gc --prune=now

# Uzak sunucuya zorla gönderme
git push origin --force
```

3. Eğer yukarıdaki komutlar çalışmazsa, şu alternatif yaklaşımı deneyin:

```bash
# Yeni bir branch oluştur
git checkout --orphan temp_branch

# İlk commit'i ekle
git add .
git commit -m "İlk commit"

# main branch'ini yeniden oluştur
git branch -D main
git branch -m main

# Değişiklikleri GitHub'a zorla gönder
git push -f origin main
```

4. Eğer GitHub Desktop kullanabiliyorsanız, bu uygulamayı kullanarak da değişiklikleri push edebilirsiniz.

5. Git LFS (Large File Storage) kullanmak istiyorsanız, şu adımları izleyin:
   - [Git LFS'i indirin ve kurun](https://git-lfs.github.com/)
   - `git lfs install` komutunu çalıştırın
   - `git lfs track "*.zip"` ile büyük dosyaları izlemeye alın
   - `.gitattributes` dosyasını commit edin
   - Dosyaları normal şekilde ekleyin ve commit edin

GitHub'daki bu sorun, Git deposunun geçmişinde büyük dosyaların bulunmasından kaynaklanıyor. Bu dosyaları tamamen kaldırmanız veya Git LFS kullanmanız gerekiyor. 