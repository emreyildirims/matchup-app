
const _svg = (paths, viewBox = "0 0 24 24") =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none"
        stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
        stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;

window.Icons = {
  home:   _svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>'),
  ball:   _svg('<circle cx="12" cy="12" r="9"/><path d="M12 7.5 8 10.4l1.5 4.6h5L16 10.4 12 7.5z"/><path d="M12 3v4.5M8 10.4 3.5 9M9.5 15l-2.7 3.7M14.5 15l2.7 3.7M16 10.4 20.5 9"/>'),
  users:  _svg('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5"/><circle cx="17.5" cy="9" r="2.6"/><path d="M16.5 14.6c2.6.3 4.4 1.9 5 4.4"/>'),
  user:   _svg('<circle cx="12" cy="8" r="4"/><path d="M4.5 21c1-4 4-6 7.5-6s6.5 2 7.5 6"/>'),

  search: _svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.8-3.8"/>'),
  bell:   _svg('<path d="M18 9a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 15 18 9z"/><path d="M10 20a2.2 2.2 0 0 0 4 0"/>'),
  pin:    _svg('<path d="M12 21s7-6.1 7-11a7 7 0 1 0-14 0c0 4.9 7 11 7 11z"/><circle cx="12" cy="10" r="2.6"/>'),
  clock:  _svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 1.8"/>'),
  calendar:_svg('<rect x="3.5" y="5" width="17" height="16" rx="3"/><path d="M8 3v4M16 3v4M3.5 10.5h17"/>'),
  star:   _svg('<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8L12 3.5z"/>'),
  plus:   _svg('<path d="M12 5v14M5 12h14"/>'),
  x:      _svg('<path d="M6 6l12 12M18 6 6 18"/>'),
  check:  _svg('<path d="m4.5 12.5 5 5 10-11"/>'),
  chevron:_svg('<path d="m9 5 7 7-7 7"/>'),
  settings:_svg('<circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-2-1.2L14 3h-4l-.5 2.6a7 7 0 0 0-2 1.2l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 5 12a7 7 0 0 0 .1 1.2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 2 1.2L10 21h4l.5-2.6a7 7 0 0 0 2-1.2l2.4 1 2-3.4-2-1.6A7 7 0 0 0 19 12z"/>'),
  trophy: _svg('<path d="M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M7 5H4a3 3 0 0 0 3 4.6M17 5h3a3 3 0 0 1-3 4.6"/><path d="M12 14v3.5M8.5 21h7M10 21v-3.5h4V21"/>'),
  map:    _svg('<path d="m9 4-5 2v14l5-2 6 2 5-2V4l-5 2-6-2z"/><path d="M9 4v14M15 6v14"/>'),
  glove:  _svg('<path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V10m0-4.5v-1a1.5 1.5 0 0 1 3 0V10m0-4a1.5 1.5 0 0 1 3 0v5"/><path d="M16 11.5a1.5 1.5 0 0 1 3 .8l-1.2 5A6 6 0 0 1 12 22h-1a5 5 0 0 1-4-2l-2.5-4c-.7-1 .3-2.5 1.6-2l1 .5"/>'),
  whistle:_svg('<circle cx="8.5" cy="14.5" r="5"/><path d="M13.5 13.5 21 9l-1.5-3-8.5 5M13 6.5l1.2 2"/>'),
  logout: _svg('<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>'),
  moon:   _svg('<path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/>'),
  globe:  _svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z"/>'),
  info:   _svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
  phone:  _svg('<path d="M5 4h4l2 5-2.5 1.5a12 12 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"/>'),
  alert:  _svg('<path d="M12 3 2.5 20h19L12 3z"/><path d="M12 10v4M12 17.5h.01"/>'),
  money:  _svg('<rect x="2.5" y="6" width="19" height="12" rx="2.5"/><circle cx="12" cy="12" r="2.6"/><path d="M6 12h.01M18 12h.01"/>'),
  target: _svg('<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>'),
  bolt:   _svg('<path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H13L13 2z"/>'),
  shieldIcon: _svg('<path d="M12 3 4.5 6v6c0 5 3.3 7.8 7.5 9 4.2-1.2 7.5-4 7.5-9V6L12 3z"/>'),

  heart:  _svg('<path d="M12 20.5S3.5 15.2 3.5 9.3A4.8 4.8 0 0 1 12 6.4a4.8 4.8 0 0 1 8.5 2.9c0 5.9-8.5 11.2-8.5 11.2z"/>'),
  chat:   _svg('<path d="M21 12a8 8 0 0 1-8 8c-1.3 0-2.6-.3-3.7-.9L4 20l1-4.9A8 8 0 1 1 21 12z"/><path d="M8.5 11h.01M12 11h.01M15.5 11h.01"/>'),
  send:   _svg('<path d="M21.5 2.5 10.8 13.2M21.5 2.5 14.7 21.5l-3.9-8.3-8.3-3.9L21.5 2.5z"/>'),
  crown:  _svg('<path d="M3.5 8.5 7.5 12l4.5-6.5L16.5 12l4-3.5-1.5 10h-14L3.5 8.5z"/><path d="M6 21h12"/>'),
  verified: _svg('<path d="M12 2.5 14.4 4.8l3.2-.4.7 3.2 2.9 1.5-1.4 2.9 1.4 2.9-2.9 1.5-.7 3.2-3.2-.4L12 21.5l-2.4-2.3-3.2.4-.7-3.2-2.9-1.5 1.4-2.9-1.4-2.9 2.9-1.5.7-3.2 3.2.4L12 2.5z"/><path d="m9 12 2 2 4-4.5"/>'),
  fire:   _svg('<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-2-5.5S14.5 6 14 3.5c-2.5 1.5-3.5 4-3.5 6.5-1-1-1.6-2-2-3.5C6.8 8.4 5 11 5 15a7 7 0 0 0 7 7z"/><path d="M12 22a3 3 0 0 0 3-3c0-1.8-1.5-3-3-5-1.5 2-3 3.2-3 5a3 3 0 0 0 3 3z"/>'),
  back:   _svg('<path d="m15 5-7 7 7 7"/>'),
  car:    _svg('<path d="M5 11 6.5 6h11L19 11"/><rect x="3.5" y="11" width="17" height="6.5" rx="2"/><circle cx="7.5" cy="17.5" r="1.8"/><circle cx="16.5" cy="17.5" r="1.8"/>'),
  coffee: _svg('<path d="M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8z"/><path d="M17 9.5h1.5a2.5 2.5 0 0 1 0 5H17M7 3.5v2M11 3.5v2"/>'),
  shower: _svg('<path d="M5 9a7 7 0 0 1 14 0"/><path d="M12 2v3M6 13v.01M9 13v.01M12 13v.01M15 13v.01M18 13v.01M7.5 17v.01M10.5 17v.01M13.5 17v.01M16.5 17v.01M9 21v.01M12 21v.01M15 21v.01"/>'),
  lamp:   _svg('<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2.1 2.1M16.9 16.9 19 19M19 5l-2.1 2.1M7.1 16.9 5 19"/>'),
  grass:  _svg('<path d="M3 20c2-5 3-9 3-13 2 3 3 7 3 13M9 20c1.5-4 3-6.5 5.5-8.5-1 3-1.5 5.5-1.5 8.5M13 20c2-3 4-4.5 7-5.5-1.5 2-2.5 3.5-3 5.5"/><path d="M2 20h20"/>'),
  medal:  _svg('<circle cx="12" cy="14.5" r="5.5"/><path d="m12 12.2 1 1.9 2.1.3-1.5 1.5.3 2.1-1.9-1-1.9 1 .3-2.1-1.5-1.5 2.1-.3 1-1.9z"/><path d="M8.5 9.5 5.5 3h4L12 8l2.5-5h4l-3 6.5"/>'),
  timer:  _svg('<circle cx="12" cy="13.5" r="7.5"/><path d="M12 10v3.5l2.3 1.5M9.5 2.5h5M12 2.5V6"/>'),

  google: `<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6z"/><path fill="#34A853" d="M12 23c3.1 0 5.7-1 7.6-2.8l-3.7-2.9c-1 .7-2.4 1.1-3.9 1.1a6.6 6.6 0 0 1-6.2-4.5H2v2.9A11.5 11.5 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.8 13.9a6.9 6.9 0 0 1 0-4.4V6.6H2a11.5 11.5 0 0 0 0 10.3l3.8-3z"/><path fill="#EA4335" d="M12 5c1.7 0 3.2.6 4.4 1.7L19.7 3.4A11.5 11.5 0 0 0 2 6.6l3.8 2.9A6.6 6.6 0 0 1 12 5z"/></svg>`
};

window.brandLogo = (size = 64) => `
  <svg width="${size}" height="${size}" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" aria-label="MatchUp logo">
    <defs>
      <linearGradient id="lgShield" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2ECC71"/>
        <stop offset="1" stop-color="#1B8F4D"/>
      </linearGradient>
    </defs>
    <!-- Kalkan -->
    <path d="M32 3 7 13v18.5C7 47 17.8 57.6 32 61 46.2 57.6 57 47 57 31.5V13L32 3z" fill="url(#lgShield)"/>
    <path d="M32 7.5 11 16v15.5C11 44.6 20.2 53.6 32 56.8 43.8 53.6 53 44.6 53 31.5V16L32 7.5z"
          fill="#0B0F0D" opacity="0.92"/>
    <!-- İnsan figürü (baş + gövde) -->
    <circle cx="32" cy="21.5" r="5" fill="#F4F7F5"/>
    <path d="M22 40c1.4-6.3 5.2-9.5 10-9.5S40.6 33.7 42 40l-4.5 2c-1-4-2.9-6-5.5-6s-4.5 2-5.5 6L22 40z" fill="#F4F7F5"/>
    <!-- Top (figürün ayağında) -->
    <circle cx="41" cy="45.5" r="6" fill="#2ECC71"/>
    <path d="M41 41.5 37.8 43.9l1.2 3.8h4l1.2-3.8L41 41.5z" fill="#0B0F0D"/>
    <path d="M41 39.8v1.7M37.8 43.9l-2.6-.9M39 47.7l-1.5 2.2M43 47.7l1.5 2.2M44.2 43.9l2.6-.9"
          stroke="#0B0F0D" stroke-width="1.1" stroke-linecap="round"/>
  </svg>`;
