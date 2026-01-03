// Reveal elements on scroll
const observer = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}})
},{threshold:0.12});
document.querySelectorAll('.reveal, .card, .service, .hero-left, .hero-right').forEach(el=>observer.observe(el));

// Smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href.startsWith('#')){
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
    }
  })
});

// Contact form submit
const form = document.getElementById('contactForm');
const notice = document.getElementById('formNotice');
if(form){
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    const data = {name: form.name.value, phone: form.phone.value, email: form.email.value, message: form.message.value};
    try{
      const res = await fetch('/api/contact', {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      if(res.ok){notice.textContent='Message sent — we will contact you shortly.';form.reset();setTimeout(()=>notice.textContent='',4000)}else{const j=await res.json();notice.textContent=j.error||'Failed to send; please call 9910534104'}
    }catch(err){notice.textContent='Network error; try calling 9910534104'}
  })
}
