// Mobil Menü Fonksiyonları
document.addEventListener('DOMContentLoaded', function() {
  // Mobil menü açma/kapama işlevi
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', function() {
      if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        mobileMenu.classList.add('flex');
        mobileMenuButton.setAttribute('aria-expanded', 'true');
      } else {
        mobileMenu.classList.add('hidden');
        mobileMenu.classList.remove('flex');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }
  
  // Sayfa yüklendiğinde bağlantıları vurgulama
  function highlightCurrentPage() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
      const linkPath = link.getAttribute('href');
      if (currentPath === linkPath || 
          (currentPath === '/' && linkPath === 'index.html') ||
          (currentPath.includes(linkPath) && linkPath !== '/')) {
        link.classList.add('text-blue-600', 'font-bold');
      }
    });
  }
  
  highlightCurrentPage();
  
  // Form gönderimi için örnek işlev
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Gerçek uygulamada burada form verileri işlenebilir
      // Örnek: fetch API kullanarak sunucuya gönderme
      
      alert('Form başarıyla gönderildi! Size en kısa sürede dönüş yapacağız.');
      contactForm.reset();
    });
  }
  
  // Sayfa içi kaydırma animasyonu
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 100,
          behavior: 'smooth'
        });
      }
    });
  });
}); 