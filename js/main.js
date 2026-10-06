/**
 * Clair Rêve Skin Clinic - Sample LP
 * Vanilla JavaScript（ライブラリ不使用）
 */
document.addEventListener('DOMContentLoaded', () => {
  initHamburger();
  initHeaderScroll();
  initFadeIn();
  initPriceTabs();
  initAccordion();
  initForm();
});

/* ---------- ハンバーガーメニュー ---------- */
function initHamburger() {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('gnav');
  if (!btn || !nav) return;

  const header = document.querySelector('.header');
  const toggle = (open) => {
    // お知らせバーの高さがあっても、メニューがヘッダーの真下から始まるようにする
    if (open && header) nav.style.top = `${header.getBoundingClientRect().bottom}px`;
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('is-menu-open', open);
  };

  btn.addEventListener('click', () => {
    toggle(btn.getAttribute('aria-expanded') !== 'true');
  });

  // メニュー内のリンクをクリックしたら閉じる
  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => toggle(false));
  });

  // Escキーで閉じる
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      toggle(false);
      btn.focus();
    }
  });

  // PC幅に戻ったら状態をリセット
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches) toggle(false);
  });
}

/* ---------- スクロールに応じたヘッダー・固定ボタン ---------- */
function initHeaderScroll() {
  const header = document.querySelector('.header');
  const pagetop = document.getElementById('pagetop');
  const fixedCta = document.getElementById('fixedCta');
  const fv = document.querySelector('.fv');
  const reserve = document.getElementById('reserve');

  let ticking = false;
  const update = () => {
    const y = window.scrollY;
    const fvBottom = fv ? fv.offsetTop + fv.offsetHeight : 600;
    const reserveRect = reserve ? reserve.getBoundingClientRect() : null;
    const isReserveVisible = reserveRect && reserveRect.top < window.innerHeight && reserveRect.bottom > 0;

    header?.classList.toggle('is-scrolled', y > 10);
    pagetop?.classList.toggle('is-show', y > fvBottom);
    // 予約フォームが見えている間は固定ボタンを隠す
    fixedCta?.classList.toggle('is-show', y > fvBottom && !isReserveVisible);
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });
  update();
}

/* ---------- スクロールでフェードイン ---------- */
function initFadeIn() {
  const targets = document.querySelectorAll('.js-fade');
  if (!('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  targets.forEach((el) => observer.observe(el));
}

/* ---------- 料金表タブ ---------- */
function initPriceTabs() {
  const tabs = Array.from(document.querySelectorAll('.price__tab'));
  if (!tabs.length) return;

  const activate = (tab) => {
    tabs.forEach((t) => {
      const selected = t === tab;
      t.classList.toggle('is-active', selected);
      t.setAttribute('aria-selected', String(selected));
      t.tabIndex = selected ? 0 : -1;
      const panel = document.getElementById(t.getAttribute('aria-controls'));
      if (panel) {
        panel.hidden = !selected;
        panel.classList.toggle('is-active', selected);
        if (selected) panel.classList.add('is-visible');
      }
    });
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(tab));
    // 左右キーでタブを移動
    tab.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = e.key === 'ArrowRight'
        ? tabs[(i + 1) % tabs.length]
        : tabs[(i - 1 + tabs.length) % tabs.length];
      activate(next);
      next.focus();
    });
  });
}

/* ---------- FAQアコーディオン ---------- */
function initAccordion() {
  document.querySelectorAll('.faq__btn').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;

    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!isOpen));

      if (isOpen) {
        // 閉じる
        const height = panel.scrollHeight;
        panel.animate(
          [{ height: `${height}px`, opacity: 1 }, { height: '0px', opacity: 0 }],
          { duration: 300, easing: 'ease' }
        ).onfinish = () => { panel.hidden = true; };
      } else {
        // 開く
        panel.hidden = false;
        const height = panel.scrollHeight;
        panel.animate(
          [{ height: '0px', opacity: 0 }, { height: `${height}px`, opacity: 1 }],
          { duration: 300, easing: 'ease' }
        );
      }
    });
  });
}

/* ---------- 予約フォームの入力チェック ---------- */
function initForm() {
  const form = document.getElementById('reserveForm');
  if (!form) return;

  // ご希望日：今日より前を選べないようにする
  const dateInput = document.getElementById('date');
  if (dateInput) {
    const today = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    dateInput.min = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`;
  }

  const rules = {
    name: (v) => (v.trim() ? '' : 'お名前を入力してください。'),
    tel: (v) => {
      if (!v.trim()) return '電話番号を入力してください。';
      return /^0\d{1,4}-?\d{1,4}-?\d{3,4}$/.test(v.trim()) ? '' : '電話番号の形式が正しくありません。';
    },
    email: (v) => {
      if (!v.trim()) return 'メールアドレスを入力してください。';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'メールアドレスの形式が正しくありません。';
    },
    date: (v) => (v ? '' : 'ご希望日を選択してください。'),
  };

  const validateField = (name) => {
    const input = form.elements[name];
    const errorEl = document.getElementById(`${name}-error`);
    const message = rules[name](input.value);
    input.classList.toggle('is-error', Boolean(message));
    input.setAttribute('aria-invalid', String(Boolean(message)));
    if (message) {
      input.setAttribute('aria-describedby', `${name}-error`);
    } else {
      input.removeAttribute('aria-describedby');
    }
    if (errorEl) errorEl.textContent = message;
    return !message;
  };

  // 入力欄から離れたときにチェック
  Object.keys(rules).forEach((name) => {
    const input = form.elements[name];
    input.addEventListener('blur', () => validateField(name));
    input.addEventListener('input', () => {
      if (input.classList.contains('is-error')) validateField(name);
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const results = Object.keys(rules).map(validateField);
    const firstError = Object.keys(rules).find((_, i) => !results[i]);

    if (firstError) {
      form.elements[firstError].focus();
      return;
    }

    // サンプルのため送信はせず、完了メッセージを表示
    const done = document.getElementById('formDone');
    if (done) {
      done.hidden = false;
      done.focus();
    }
    form.reset();
  });
}
