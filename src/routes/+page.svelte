<script lang="ts">
	import {
		ArrowDown,
		Blocks,
		ChevronsRight,
		FlaskConical,
		Rocket,
		ShoppingCart,
		LoaderCircleIcon,
	} from "lucide-svelte"
	import { onMount } from "svelte"
	import { browser } from "$app/environment"
	import {
		PUBLIC_HACKCLUB_AUTH,
		PUBLIC_HACKCLUB_REDIRECT,
		PUBLIC_TURNED_OFF,
	} from "$env/static/public"
	import Accordion from "$lib/components/accordion.svelte"
	import Button from "$lib/components/ui/button/button.svelte"

	let { data } = $props()
	let rsvpCount: number | "Fetching" = $state("Fetching")
	let showRotator = $state(false)
	const clientId = PUBLIC_HACKCLUB_AUTH
	const uri = encodeURIComponent(PUBLIC_HACKCLUB_REDIRECT)

	let hasaccessToken = $state(
		browser &&
			document.cookie.split("; ").find(row => row.startsWith("slack_id=")) !==
				undefined
	)

	let authUrl = $derived(
		PUBLIC_TURNED_OFF !== "false"
			? `./turned-off`
			: hasaccessToken
				? `./dashboard/projects`
				: `/auth`
	)

	let referUrl = $state(`./refer`)

	const targetDate = new Date("2026-06-21T01:00:00Z").getTime()
	let timeLeft = $state(Math.max(0, targetDate - Date.now()))

	let time = $derived(formatTime(timeLeft))

	$effect(() => {
		const interval = setInterval(() => {
			const difference = targetDate - Date.now()

			if (difference <= 0) {
				timeLeft = 0
				clearInterval(interval)
			} else {
				timeLeft = difference
			}
		}, 1000)

		return () => clearInterval(interval)
	})

	function formatTime(ms: number) {
		if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }

		const seconds = Math.floor((ms / 1000) % 60)
		const minutes = Math.floor((ms / 1000 / 60) % 60)
		const hours = Math.floor((ms / (1000 * 60 * 60)) % 24)
		const days = Math.floor(ms / (1000 * 60 * 60 * 24))

		return {
			days: days.toString().padStart(2, "0"),
			hours: hours.toString().padStart(2, "0"),
			minutes: minutes.toString().padStart(2, "0"),
			seconds: seconds.toString().padStart(2, "0"),
		}
	}

	onMount(() => {
		const html = document.documentElement
		const wasDark = html.classList.contains("dark")
		html.classList.remove("dark")

		if (data.error) {
			alert(data.error)
		}
		hasaccessToken =
			document.cookie.split("; ").find(row => row.startsWith("slack_id=")) !==
			undefined

		authUrl =
			PUBLIC_TURNED_OFF !== "false"
				? `./turned-off`
				: hasaccessToken
					? `./dashboard`
					: `/auth`
		fetch("/rsvp")
			.then(res => res.json())
			.then(data => (rsvpCount = data.count))

		referUrl =
			PUBLIC_TURNED_OFF !== "false"
				? `./turned-off`
				: hasaccessToken
					? `./refer`
					: `/auth`
		fetch("/rsvp")
			.then(res => res.json())
			.then(data => (rsvpCount = data.count))

		return () => {
			if (wasDark) html.classList.add("dark")
		}
	})
</script>



  <!-- ═══════════════════════════════════════════════
       GLOBAL HEADER — Fixed top bar
       ═══════════════════════════════════════════════ -->
  <header class="fixed inset-x-0 top-0 z-1000 h-16 pointer-events-none" id="site-header">
    <div class="h-full max-w-full flex items-center justify-end px-10">
      <div class="flex-1"></div>
      <a href={authUrl}  type="button"
        class="pointer-events-auto inline-flex items-center justify-center mt-5 mr-6 py-2.5 px-5 text-sm font-bold tracking-[0.03em] rounded-sm cursor-pointer bg-gold text-ink shadow-[0_4px_0_0_#b86c2a] transition-[transform,box-shadow,background-color] duration-300 ease-[ease] hover:bg-gold-light active:translate-y-[3px] active:shadow-[0_1px_0_0_#b86c2a]"
         id="btn-header-oauth" >
        Sign in with Hack Club
      </a>
    </div>
  </header>


  <!-- ═══════════════════════════════════════════════
       SECTION 1 — HERO (100vh)
       ═══════════════════════════════════════════════ -->
  <section id="hero" class="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
    <div class="absolute inset-0 pointer-events-none z-0">
      <div class="absolute inset-0 pointer-events-none z-0 bg-plum"></div>
      <div class="absolute inset-0 pointer-events-none z-1">
        <div class="asset-slot top-[10%] left-0 w-80 h-[480px]" aria-hidden="true"><!-- SVG/PNG: left background art -->
        </div>
        <div class="asset-slot top-[5%] right-0 w-[350px] h-[500px]" aria-hidden="true">
          <!-- SVG/PNG: right background art -->
        </div>
      </div>
      <div class="absolute inset-0 pointer-events-none z-2">
        <div class="asset-slot top-[60px] left-20 size-30" aria-hidden="true"><!-- SVG/PNG: top-left sparkle cluster --></div>
        <div class="asset-slot bottom-20 right-[100px] size-[140px]" aria-hidden="true"><!-- SVG/PNG: bottom-right sparkle cluster --></div>
      </div>
    </div>

    <div
      class="relative z-2 w-full max-w-[1440px] mx-auto min-h-screen grid grid-cols-2 items-center gap-12 pt-[100px] px-12 pb-20">
      <!-- Left column: brand + copy + email CTA -->
      <div class="flex flex-col items-start gap-5">
        <img src="assets/Alchemize.png" alt="Alchemize Logo"
          class="w-[440px] h-[130px] object-contain object-left -mb-8" />

        <p class="max-w-[540px] text-[1.15rem] leading-[1.8] text-muted-alt">
          Make themed projects, get themed prizes! With more mixing this time around!
        </p>

        <div class="flex flex-col items-start gap-4">
          <div class="flex items-stretch h-[52px] border-2 border-subtle rounded-sm overflow-hidden">
            <input type="email" id="hero-email"
              class="w-[300px] px-5 text-[1rem] text-cream bg-surface/35 outline-none placeholder:text-muted-alt-alt/70"
              placeholder="you@hackclub.com" aria-label="Email address" />
            <a href={authUrl}  type="button"
              class="inline-flex items-center justify-center px-7 text-[1rem] font-bold tracking-[0.03em] cursor-pointer bg-surface text-cream border-l-2 border-subtle transition-[transform,box-shadow,background-color] duration-300 ease-[ease] hover:bg-lavender active:translate-y-[2px]"
               id="btn-sign-in" >Sign In</a>
          </div>
        </div>
      </div>

      <!-- Right column: hero illustration -->
      <div class="flex items-center justify-center h-full">
        <div
          class="relative w-full max-w-[560px] h-[480px] flex items-center justify-center border-2 border-dashed border-subtle rounded-lg">
          <div class="asset-slot relative size-full border-none" aria-hidden="true">
            <!-- SVG/PNG: main hero illustration -->
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- ═══════════════════════════════════════════════
       SECTION 2 — HOW IT WORKS (100vh)
       ═══════════════════════════════════════════════ -->
  <section id="how-it-works" class="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
    <div class="absolute inset-0 pointer-events-none z-0">
      <div class="absolute inset-0 pointer-events-none z-0 bg-plum-deep"></div>
      <div class="absolute inset-0 pointer-events-none z-1">
        <div class="asset-slot inset-0 size-full border-none" aria-hidden="true"><!-- SVG/PNG: subtle tiled pattern -->
        </div>
      </div>
      <div class="absolute inset-0 pointer-events-none z-2">
        <div class="asset-slot top-10 right-10 size-45" aria-hidden="true"><!-- SVG/PNG: decorative corner --></div>
      </div>
    </div>

    <div class="relative z-2 w-full max-w-content mx-auto px-12 py-12">
      <h2 class="font-heading text-[3rem] font-bold text-cream text-center mb-3 tracking-[-0.02em]">How does this work?
      </h2>
      <p class="text-[1.15rem] text-muted-alt text-center mb-12">Lorem ipsum dolor sit amet — it's all in the cards!</p>

      <div class="relative max-w-[1100px] h-[1000px] mx-auto grid grid-rows-4">
        <!-- Background orbit arcs -->
        <svg class="absolute top-0 left-0 size-full pointer-events-none z-0" aria-hidden="true" viewBox="0 0 1100 1000"
          preserveAspectRatio="none">
          <circle class="stroke-subtle" cx="550" cy="-80" r="280" fill="none" stroke-width="1" opacity="0.25" />
          <circle class="stroke-subtle" cx="550" cy="-80" r="400" fill="none" stroke-width="1" opacity="0.15" />
          <circle class="stroke-subtle" cx="550" cy="-80" r="520" fill="none" stroke-width="1" opacity="0.08" />
        </svg>



        <!-- Step 1 — text LEFT | art RIGHT -->
        <div class="relative z-2 grid grid-cols-2 items-center gap-12 px-5">
          <div class="w-[380px] ml-auto text-left">
            <div class="flex items-center justify-start gap-3 mb-2">
              <span
                class="inline-flex shrink-0 items-center justify-center size-9 rounded-full bg-berry text-cream font-extrabold text-[1rem]">1</span>
              <h3 class="font-heading text-[1.35rem] font-bold text-cream">Pick a Idea</h3>
            </div>
            <p class="text-[0.9rem] leading-[1.65] text-muted-alt max-w-[360px]">Got your own idea? Build it. Making something completely ridiculous that nobody asked for. Just pick a project you’re actually hyped to ship.</p>
          </div>
          <div class="w-full h-[240px] pl-0 pr-6 flex justify-start">
            <img src="assets/step%201.png" alt="Step 1 Illustration" class="max-h-full w-auto object-contain" />
          </div>
        </div>

        <!-- Step 2 — art LEFT | text RIGHT -->
        <div class="relative z-2 grid grid-cols-2 items-center gap-12 px-5">
          <div class="w-full h-[240px] pl-6 pr-0 flex justify-end">
            <img src="assets/step%202.png" alt="Step 2 Illustration" class="max-h-full w-auto object-contain" />
          </div>
          <div class="w-[380px] text-left">
            <div class="flex items-center justify-start gap-3 mb-2">
              <span
                class="inline-flex shrink-0 items-center justify-center size-9 rounded-full bg-berry text-cream font-extrabold text-[1rem]">2</span>
              <h3 class="font-heading text-[1.35rem] font-bold text-cream">Build the Project</h3>
            </div>
            <p class="text-[0.9rem] leading-[1.65] text-muted-alt max-w-[360px]">Turn your idea into a real, working project. Code it, design it, and ship it-just remember to log your hours as you build.</p>
          </div>
        </div>

        <!-- Step 3 — text LEFT | art RIGHT -->
        <div class="relative z-2 grid grid-cols-2 items-center gap-12 px-5">
          <div class="w-[380px] ml-auto text-left">
            <div class="flex items-center justify-start gap-3 mb-2">
              <span
                class="inline-flex shrink-0 items-center justify-center size-9 rounded-full bg-berry text-cream font-extrabold text-[1rem]">3</span>
              <h3 class="font-heading text-[1.35rem] font-bold text-cream">Send It for Review</h3>
            </div>
            <p class="text-[0.9rem] leading-[1.65] text-muted-alt max-w-[360px]">Once your project is ready, submit it with a short description and a link to try it out. Our reviewers will check it and approve your hours.</p>
          </div>
          <div class="w-full h-[240px] pl-0 pr-6 flex justify-start">
            <img src="assets/step%203.png" alt="Step 3 Illustration" class="max-h-full w-auto object-contain" />
          </div>
        </div>

        <!-- Step 4 — art LEFT | text RIGHT -->
        <div class="relative z-2 grid grid-cols-2 items-center gap-12 px-5">
          <div class="w-full h-[240px] pl-6 pr-0 flex justify-end">
            <img src="assets/step%204.png" alt="Step 4 Illustration" class="max-h-full w-auto object-contain" />
          </div>
          <div class="w-[380px] text-left">
            <div class="flex items-center justify-start gap-3 mb-2">
              <span
                class="inline-flex shrink-0 items-center justify-center size-9 rounded-full bg-berry text-cream font-extrabold text-[1rem]">4</span>
              <h3 class="font-heading text-[1.35rem] font-bold text-cream">Spend Your Potion</h3>
            </div>
            <p class="text-[0.9rem] leading-[1.65] text-muted-alt max-w-[360px]">Every approved hour fills your potion. Spend it in the shop on amazing rewards like hardware, tools and licenses to power your next build.</p>
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- ═══════════════════════════════════════════════
       SECTION 3 — WHAT HACK CLUBBERS MADE (100vh)
       ═══════════════════════════════════════════════ -->
  <section id="projects" class="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
    <div class="absolute inset-0 pointer-events-none z-0">
      <div class="absolute inset-0 pointer-events-none z-0 bg-plum"></div>
      <div class="absolute inset-0 pointer-events-none z-1">
        <div class="asset-slot inset-0 size-full border-none" aria-hidden="true">
          <!-- SVG/PNG: scattered background shapes -->
        </div>
      </div>
      <div class="absolute inset-0 pointer-events-none z-2">
        <div class="asset-slot bottom-0 left-0 size-50" aria-hidden="true"><!-- SVG/PNG: bottom-left vine --></div>
        <div class="asset-slot top-10 right-10 w-40 h-60" aria-hidden="true"><!-- SVG/PNG: top-right potion bottle --></div>
      </div>
    </div>

    <div class="relative z-2 w-full max-w-content mx-auto px-12 py-[60px]">
      <div class="flex items-center justify-center mb-12">
        <h2 class="font-heading text-[3rem] font-bold text-cream text-center mb-3 tracking-[-0.02em]">What Hack Clubbers
          Made</h2>
        <div class="asset-slot relative inline-flex w-20 h-10 ml-3" aria-hidden="true">
          <!-- SVG/PNG: heading decoration -->
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-6 gap-6">
        <!-- 1. LibrePods (Top row, span 3 cols) -->
        <a href="https://github.com/librepods-org/librepods" target="_blank" rel="noreferrer"
          class="group md:col-span-3 flex flex-col overflow-hidden bg-surface border-2 border-blossom rounded-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-gold">
          <div
            class="relative w-full aspect-video flex items-center justify-center bg-plum/50 border-b-2 border-blossom transition-colors duration-500 group-hover:border-gold group-hover:bg-plum/60">
            <img src="https://crescent.hackclub.com/vite/assets/librepods-BU-zFwYq.webp" alt="LibrePods" class="w-full h-full object-cover" />
          </div>
          <div class="px-5 py-5 flex flex-col flex-1 bg-ink/50">
            <h3 class="font-heading text-[1.2rem] font-bold mb-1.5 text-cream">LibrePods</h3>
            <p class="text-[0.9rem] text-muted-alt leading-[1.5] mb-4">AirPods off Apple's leash: noise control, ear detection and battery on Android and Linux.</p>
            <div class="flex items-center justify-between mt-auto">
              <span class="text-[0.8rem] text-blossom font-semibold">@kavishdevar</span>
              <span class="text-[0.7rem] px-2 py-0.5 rounded-full border border-subtle text-muted-alt">Kotlin</span>
            </div>
          </div>
        </a>

        <!-- 2. Specter (Top row, span 3 cols) -->
        <a href="https://shaaarkai.itch.io/specter" target="_blank" rel="noreferrer"
          class="group md:col-span-3 flex flex-col overflow-hidden bg-surface border-2 border-blossom rounded-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-gold">
          <div
            class="relative w-full aspect-video flex items-center justify-center bg-plum/50 border-b-2 border-blossom transition-colors duration-500 group-hover:border-gold group-hover:bg-plum/60">
            <img src="https://crescent.hackclub.com/vite/assets/specter-BHuwe-eU.webp" alt="Specter" class="w-full h-full object-cover" />
          </div>
          <div class="px-5 py-5 flex flex-col flex-1 bg-ink/50">
            <h3 class="font-heading text-[1.2rem] font-bold mb-1.5 text-cream">Specter</h3>
            <p class="text-[0.9rem] text-muted-alt leading-[1.5] mb-4">A platformer where the run you just failed comes back as a ghost, and helping it is how you finish the level.</p>
            <div class="flex items-center justify-between mt-auto">
              <span class="text-[0.8rem] text-blossom font-semibold">@ayessaaa</span>
              <span class="text-[0.7rem] px-2 py-0.5 rounded-full border border-subtle text-muted-alt">GDScript</span>
            </div>
          </div>
        </a>

        <!-- 3. VERT (Bottom row, span 2 cols) -->
        <a href="https://vert.sh" target="_blank" rel="noreferrer"
          class="group md:col-span-2 flex flex-col overflow-hidden bg-surface border-2 border-blossom rounded-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-gold">
          <div
            class="relative w-full aspect-video flex items-center justify-center bg-plum/50 border-b-2 border-blossom transition-colors duration-500 group-hover:border-gold group-hover:bg-plum/60">
            <img src="https://crescent.hackclub.com/vite/assets/vert-D90femPm.webp" alt="VERT" class="w-full h-full object-cover" />
          </div>
          <div class="px-4 py-4 flex flex-col flex-1 bg-ink/50">
            <h3 class="font-heading text-[1.1rem] font-bold mb-1 text-cream">VERT</h3>
            <p class="text-[0.8rem] text-muted-alt leading-[1.5] mb-3 line-clamp-3">A file converter for images, audio and documents that does the work in your own browser rather than on somebody's server.</p>
            <div class="flex items-center justify-between mt-auto">
              <span class="text-[0.75rem] text-blossom font-semibold truncate max-w-[80px]">@JovannMC</span>
              <span class="text-[0.65rem] px-2 py-0.5 rounded-full border border-subtle text-muted-alt">Svelte</span>
            </div>
          </div>
        </a>

        <!-- 4. Blind Defusal (Bottom row, span 2 cols) -->
        <a href="https://blind-defusal.jayx2u.fyi" target="_blank" rel="noreferrer"
          class="group md:col-span-2 flex flex-col overflow-hidden bg-surface border-2 border-blossom rounded-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-gold">
          <div
            class="relative w-full aspect-video flex items-center justify-center bg-plum/50 border-b-2 border-blossom transition-colors duration-500 group-hover:border-gold group-hover:bg-plum/60">
            <img src="https://crescent.hackclub.com/vite/assets/blind-defusal-CgCv7Jns.webp" alt="Blind Defusal" class="w-full h-full object-cover" />
          </div>
          <div class="px-4 py-4 flex flex-col flex-1 bg-ink/50">
            <h3 class="font-heading text-[1.1rem] font-bold mb-1 text-cream line-clamp-1">Blind Defusal</h3>
            <p class="text-[0.8rem] text-muted-alt leading-[1.5] mb-3 line-clamp-3">A two-player bomb to defuse. One of you holds the box, the other holds the manual, and neither can see the other's half.</p>
            <div class="flex items-center justify-between mt-auto">
              <span class="text-[0.75rem] text-blossom font-semibold truncate max-w-[80px]">@Jayx2u</span>
              <span class="text-[0.65rem] px-1.5 py-0.5 rounded-full border border-subtle text-muted-alt">Python</span>
            </div>
          </div>
        </a>

        <!-- 5. Angel Keyboard (Bottom row, span 2 cols) -->
        <a href="https://github.com/geg-tech/biblicallyaccuratekeyboard" target="_blank" rel="noreferrer"
          class="group md:col-span-2 flex flex-col overflow-hidden bg-surface border-2 border-blossom rounded-md transition-all duration-500 ease-out hover:-translate-y-2 hover:border-gold">
          <div
            class="relative w-full aspect-video flex items-center justify-center bg-plum/50 border-b-2 border-blossom transition-colors duration-500 group-hover:border-gold group-hover:bg-plum/60">
            <img src="https://crescent.hackclub.com/vite/assets/angel-keyboard-DXV1reQP.webp" alt="Biblically Accurate Keyboard" class="w-full h-full object-cover" />
          </div>
          <div class="px-4 py-4 flex flex-col flex-1 bg-ink/50">
            <h3 class="font-heading text-[1.1rem] font-bold mb-1 text-cream line-clamp-1" title="Biblically Accurate Keyboard">Angel Keyboard</h3>
            <p class="text-[0.8rem] text-muted-alt leading-[1.5] mb-3 line-clamp-3">A keyboard in the shape of a biblically accurate angel. Be not afraid. CAD, PCBs and all.</p>
            <div class="flex items-center justify-between mt-auto">
              <span class="text-[0.75rem] text-blossom font-semibold truncate max-w-[80px]">@geg-tech</span>
              <span class="text-[0.65rem] px-1.5 py-0.5 rounded-full border border-subtle text-muted-alt">Hardware</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  </section>


  <!-- ═══════════════════════════════════════════════
       SECTION 4 — PRIZES & LOOT (100vh)
       ═══════════════════════════════════════════════ -->
  <section id="prizes" class="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
    <div class="absolute inset-0 pointer-events-none z-0">
      <div class="absolute inset-0 pointer-events-none z-0 bg-plum-deep"></div>
      <div class="absolute inset-0 pointer-events-none z-1">
        <div class="asset-slot inset-0 size-full border-none" aria-hidden="true"><!-- SVG/PNG: star field --></div>
      </div>
      <div class="absolute inset-0 pointer-events-none z-2">
        <div class="asset-slot bottom-0 left-10 size-50" aria-hidden="true"><!-- SVG/PNG: treasure chest corner --></div>
      </div>
    </div>

    <div class="relative z-2 w-full max-w-content mx-auto px-12 pt-[60px] pb-10 flex flex-col items-center">
      <h2 class="font-heading text-[3rem] font-bold text-cream text-center mb-3 tracking-[-0.02em]">The Shop</h2>
      <p class="text-[1.15rem] text-muted-alt text-center mb-12">Ship real projects. Earn real rewards.</p>

      <!-- Infinite marquee ribbon (Forward / Left) -->
      <div
        class="group relative w-full overflow-hidden mt-8 py-4 border-2 border-subtle rounded-md"
        data-marquee aria-label="Prize items scrolling ribbon forward">
        <div class="flex w-max animate-marquee will-change-transform group-hover:[animation-play-state:paused]"
          id="marquee-track-1" data-marquee-track>
          <div class="flex items-center gap-10 pr-10 shrink-0">
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec54a-4041-7edf-a051-3d62cc90ef3b/image.png" alt="Flipper Zero" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Flipper Zero</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ecafb-e62b-7203-8d27-855881acf1d5/image.png" alt="Drawing Tablet" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Drawing Tablet</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019f0843-9ba2-7bca-9af6-fc16315a8a14/image.png" alt="Notion Pro" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Notion Pro</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019f084c-51f2-702e-b7ae-455bf1a8b372/image.png" alt="Steam License" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Steam License</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec53d-1868-7dbb-923e-e29e17cea5bf/image.png" alt="Apple Developer" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Apple Developer</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec54c-0423-7d62-bd83-77fecd915474/image.png" alt="Cloud Hosting" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Cloud Hosting</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec540-1c1b-79d5-950b-6718cee53544/image.png" alt="PICO-8 License" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">PICO-8 License</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec53b-b12c-733f-987d-150010308fe2/image.png" alt="Google Play Console" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Google Play Console</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019f0844-322a-79df-8cc6-a96605ece55d/image.png" alt="Figma Pro" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Figma Pro</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec542-9564-778a-8234-4809a3ce9553/image.png" alt="RAM Grant" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">RAM Grant</span>
            </div>
          </div>
          <!-- Duplicate group for seamless infinite loop -->
          <div class="flex items-center gap-10 pr-10 shrink-0" aria-hidden="true">
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec54a-4041-7edf-a051-3d62cc90ef3b/image.png" alt="Flipper Zero" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Flipper Zero</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ecafb-e62b-7203-8d27-855881acf1d5/image.png" alt="Drawing Tablet" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Drawing Tablet</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019f0843-9ba2-7bca-9af6-fc16315a8a14/image.png" alt="Notion Pro" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Notion Pro</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019f084c-51f2-702e-b7ae-455bf1a8b372/image.png" alt="Steam License" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Steam License</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec53d-1868-7dbb-923e-e29e17cea5bf/image.png" alt="Apple Developer" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Apple Developer</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec54c-0423-7d62-bd83-77fecd915474/image.png" alt="Cloud Hosting" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Cloud Hosting</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec540-1c1b-79d5-950b-6718cee53544/image.png" alt="PICO-8 License" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">PICO-8 License</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec53b-b12c-733f-987d-150010308fe2/image.png" alt="Google Play Console" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Google Play Console</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019f0844-322a-79df-8cc6-a96605ece55d/image.png" alt="Figma Pro" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Figma Pro</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec542-9564-778a-8234-4809a3ce9553/image.png" alt="RAM Grant" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">RAM Grant</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Infinite marquee ribbon (Reverse / Right) -->
      <div
        class="group relative w-full overflow-hidden mt-[calc(14px+1rem)] mb-12 py-4 border-2 border-subtle rounded-md"
        data-marquee aria-label="Prize items scrolling ribbon reverse">
        <div class="flex w-max animate-marquee-reverse will-change-transform group-hover:[animation-play-state:paused]"
          id="marquee-track-2" data-marquee-track>
          <div class="flex items-center gap-10 pr-10 shrink-0">
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec54d-560f-70e7-be4a-e0b86111006e/image.png" alt="Raspberry Pi 5" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Raspberry Pi 5</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec548-5aa1-7e2b-b1bb-552b2ba493e1/image.png" alt="Logitech MX Master 3S" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Logitech MX Master 3S</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://user-cdn.hackclub-assets.com/019ec539-e599-73f3-bce2-f86321bcafa4/image.png" alt="Steam Gift Card" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Steam Gift Card</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019f083e-dea1-7a71-9ef8-45f188d727dd/image.png" alt="Monitor Grant" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Monitor Grant</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019f0862-2401-783e-9207-f51fe350b8c9/download%20(2).webp" alt="PC Component Grant" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">PC Component Grant</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019f4099-a08c-7769-95f6-aee571621ce7/image.png" alt="Laptop Grant" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Laptop Grant</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019f0853-2d31-77ce-a55a-afaad735121f/images%20(18).jpeg" alt="Headphone Grant" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Headphone Grant</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.shopify.com/s/files/1/0376/5420/0459/files/0000s_0079_CMF-Buds-2-Plus-case-lightgrey.png?v=1753435229" alt="CMF Buds 2 Plus" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">CMF Buds 2 Plus</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.shopify.com/s/files/1/0585/2479/5086/files/BulbT-White.png?v=1761642546" alt="Nothing Phone 3A Lite" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Nothing Phone 3A Lite</span>
            </div>
          </div>
          <!-- Duplicate group for seamless infinite loop -->
          <div class="flex items-center gap-10 pr-10 shrink-0" aria-hidden="true">
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec54d-560f-70e7-be4a-e0b86111006e/image.png" alt="Raspberry Pi 5" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Raspberry Pi 5</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019ec548-5aa1-7e2b-b1bb-552b2ba493e1/image.png" alt="Logitech MX Master 3S" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Logitech MX Master 3S</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://user-cdn.hackclub-assets.com/019ec539-e599-73f3-bce2-f86321bcafa4/image.png" alt="Steam Gift Card" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Steam Gift Card</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019f083e-dea1-7a71-9ef8-45f188d727dd/image.png" alt="Monitor Grant" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Monitor Grant</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019f0862-2401-783e-9207-f51fe350b8c9/download%20(2).webp" alt="PC Component Grant" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">PC Component Grant</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019f4099-a08c-7769-95f6-aee571621ce7/image.png" alt="Laptop Grant" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Laptop Grant</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.hackclub.com/019f0853-2d31-77ce-a55a-afaad735121f/images%20(18).jpeg" alt="Headphone Grant" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Headphone Grant</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.shopify.com/s/files/1/0376/5420/0459/files/0000s_0079_CMF-Buds-2-Plus-case-lightgrey.png?v=1753435229" alt="CMF Buds 2 Plus" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">CMF Buds 2 Plus</span>
            </div>
            <div class="shrink-0 w-[180px] flex flex-col items-center gap-2.5">
              <div class="relative w-[140px] h-[100px] flex items-center justify-center">
                <img src="https://cdn.shopify.com/s/files/1/0585/2479/5086/files/BulbT-White.png?v=1761642546" alt="Nothing Phone 3A Lite" class="max-w-full max-h-full object-contain" />
              </div>
              <span class="text-[0.85rem] font-semibold text-muted-alt text-center whitespace-nowrap">Nothing Phone 3A Lite</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- ═══════════════════════════════════════════════
       SECTION 5 — FAQ (100vh)
       ═══════════════════════════════════════════════ -->
  <section id="faq" class="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
    <div class="absolute inset-0 pointer-events-none z-0">
      <div class="absolute inset-0 pointer-events-none z-0 bg-plum"></div>
      <div class="absolute inset-0 pointer-events-none z-1">
        <div class="asset-slot inset-0 size-full border-none" aria-hidden="true"><!-- SVG/PNG: parchment texture -->
        </div>
      </div>
      <div class="absolute inset-0 pointer-events-none z-2">
        <div class="asset-slot top-1/2 left-5 w-25 h-75 -translate-y-1/2" aria-hidden="true"><!-- SVG/PNG: scroll decoration --></div>
      </div>
    </div>

    <div class="relative z-2 w-full max-w-[820px] mx-auto px-12 py-20">
      <div class="text-center mb-12">
        <img src="assets/faq-title.svg" alt="Frequently Asked Questions"
          class="inline-block max-h-16 w-auto min-w-80 min-h-14 border-2 border-dashed border-subtle rounded-sm" />
      </div>

      <div class="flex flex-col" id="faq-accordion">
        <div class="border-b-2 border-subtle first:border-t-2">
          <button
            class="group w-full flex items-center justify-between py-[22px] px-2 text-[1.1rem] font-semibold text-cream text-left cursor-pointer transition-colors duration-300 ease-[ease] hover:text-gold"
            data-accordion-trigger aria-expanded="false" id="faq-btn-1" aria-controls="faq-panel-1">
            <span>Who is eligible?</span>
            <span
              class="relative shrink-0 size-6 ml-5 before:absolute before:top-1/2 before:left-1/2 before:w-[18px] before:h-[3px] before:-translate-1/2 before:rounded-[2px] before:bg-blossom before:transition-colors before:duration-300 after:absolute after:top-1/2 after:left-1/2 after:w-[3px] after:h-[18px] after:-translate-1/2 after:rounded-[2px] after:bg-blossom after:transition-all after:duration-300 group-aria-expanded:before:bg-gold group-aria-expanded:after:bg-gold group-aria-expanded:after:rotate-90 group-aria-expanded:after:opacity-0"
              aria-hidden="true"></span>
          </button>
          <div class="max-h-0 overflow-hidden transition-[max-height,padding] duration-400 ease-[ease]" id="faq-panel-1"
            role="region" aria-labelledby="faq-btn-1">
            <p class="px-2 pb-6 text-[0.95rem] leading-[1.75] text-muted-alt">Anyone aged 13 through 18! Everyone from all over the world can participate.</p>
          </div>
        </div>

        <div class="border-b-2 border-subtle first:border-t-2">
          <button
            class="group w-full flex items-center justify-between py-[22px] px-2 text-[1.1rem] font-semibold text-cream text-left cursor-pointer transition-colors duration-300 ease-[ease] hover:text-gold"
            data-accordion-trigger aria-expanded="false" id="faq-btn-2" aria-controls="faq-panel-2">
            <span>Is this free/legit?</span>
            <span
              class="relative shrink-0 size-6 ml-5 before:absolute before:top-1/2 before:left-1/2 before:w-[18px] before:h-[3px] before:-translate-1/2 before:rounded-[2px] before:bg-blossom before:transition-colors before:duration-300 after:absolute after:top-1/2 after:left-1/2 after:w-[3px] after:h-[18px] after:-translate-1/2 after:rounded-[2px] after:bg-blossom after:transition-all after:duration-300 group-aria-expanded:before:bg-gold group-aria-expanded:after:bg-gold group-aria-expanded:after:rotate-90 group-aria-expanded:after:opacity-0"
              aria-hidden="true"></span>
          </button>
          <div class="max-h-0 overflow-hidden transition-[max-height,padding] duration-400 ease-[ease]" id="faq-panel-2"
            role="region" aria-labelledby="faq-btn-2">
            <p class="px-2 pb-6 text-[0.95rem] leading-[1.75] text-muted-alt">Yeah! Hack Club is a 501(c)(3) non-profit, with donations from donors like Michael Dell and Tom Preston-Werner covering all of the prizes! We also ran programs like High Seas, Summer of Making, Flavortown in the past.</p>
          </div>
        </div>

        <div class="border-b-2 border-subtle first:border-t-2">
          <button
            class="group w-full flex items-center justify-between py-[22px] px-2 text-[1.1rem] font-semibold text-cream text-left cursor-pointer transition-colors duration-300 ease-[ease] hover:text-gold"
            data-accordion-trigger aria-expanded="false" id="faq-btn-3" aria-controls="faq-panel-3">
            <span>What types of projects count?</span>
            <span
              class="relative shrink-0 size-6 ml-5 before:absolute before:top-1/2 before:left-1/2 before:w-[18px] before:h-[3px] before:-translate-1/2 before:rounded-[2px] before:bg-blossom before:transition-colors before:duration-300 after:absolute after:top-1/2 after:left-1/2 after:w-[3px] after:h-[18px] after:-translate-1/2 after:rounded-[2px] after:bg-blossom after:transition-all after:duration-300 group-aria-expanded:before:bg-gold group-aria-expanded:after:bg-gold group-aria-expanded:after:rotate-90 group-aria-expanded:after:opacity-0"
              aria-hidden="true"></span>
          </button>
          <div class="max-h-0 overflow-hidden transition-[max-height,padding] duration-400 ease-[ease]" id="faq-panel-3"
            role="region" aria-labelledby="faq-btn-3">
            <p class="px-2 pb-6 text-[0.95rem] leading-[1.75] text-muted-alt">All kinds of technical projects, as long as they’re open-source! (Note: We don't support hardware projects just yet.)</p>
          </div>
        </div>

        <div class="border-b-2 border-subtle first:border-t-2">
          <button
            class="group w-full flex items-center justify-between py-[22px] px-2 text-[1.1rem] font-semibold text-cream text-left cursor-pointer transition-colors duration-300 ease-[ease] hover:text-gold"
            data-accordion-trigger aria-expanded="false" id="faq-btn-4" aria-controls="faq-panel-4">
            <span>Duis aute irure dolor in reprehenderit?</span>
            <span
              class="relative shrink-0 size-6 ml-5 before:absolute before:top-1/2 before:left-1/2 before:w-[18px] before:h-[3px] before:-translate-1/2 before:rounded-[2px] before:bg-blossom before:transition-colors before:duration-300 after:absolute after:top-1/2 after:left-1/2 after:w-[3px] after:h-[18px] after:-translate-1/2 after:rounded-[2px] after:bg-blossom after:transition-all after:duration-300 group-aria-expanded:before:bg-gold group-aria-expanded:after:bg-gold group-aria-expanded:after:rotate-90 group-aria-expanded:after:opacity-0"
              aria-hidden="true"></span>
          </button>
          <div class="max-h-0 overflow-hidden transition-[max-height,padding] duration-400 ease-[ease]" id="faq-panel-4"
            role="region" aria-labelledby="faq-btn-4">
            <p class="px-2 pb-6 text-[0.95rem] leading-[1.75] text-muted-alt">At vero eos et accusamus et iusto odio
              dignissimos ducimus qui blanditiis
              praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati
              cupiditate non provident.</p>
          </div>
        </div>

        <div class="border-b-2 border-subtle first:border-t-2">
          <button
            class="group w-full flex items-center justify-between py-[22px] px-2 text-[1.1rem] font-semibold text-cream text-left cursor-pointer transition-colors duration-300 ease-[ease] hover:text-gold"
            data-accordion-trigger aria-expanded="false" id="faq-btn-5" aria-controls="faq-panel-5">
            <span>Excepteur sint occaecat cupidatat?</span>
            <span
              class="relative shrink-0 size-6 ml-5 before:absolute before:top-1/2 before:left-1/2 before:w-[18px] before:h-[3px] before:-translate-1/2 before:rounded-[2px] before:bg-blossom before:transition-colors before:duration-300 after:absolute after:top-1/2 after:left-1/2 after:w-[3px] after:h-[18px] after:-translate-1/2 after:rounded-[2px] after:bg-blossom after:transition-all after:duration-300 group-aria-expanded:before:bg-gold group-aria-expanded:after:bg-gold group-aria-expanded:after:rotate-90 group-aria-expanded:after:opacity-0"
              aria-hidden="true"></span>
          </button>
          <div class="max-h-0 overflow-hidden transition-[max-height,padding] duration-400 ease-[ease]" id="faq-panel-5"
            role="region" aria-labelledby="faq-btn-5">
            <p class="px-2 pb-6 text-[0.95rem] leading-[1.75] text-muted-alt">Similique sunt in culpa qui officia deserunt
              mollitia animi, id est laborum et
              dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</p>
          </div>
        </div>

        <div class="border-b-2 border-subtle first:border-t-2">
          <button
            class="group w-full flex items-center justify-between py-[22px] px-2 text-[1.1rem] font-semibold text-cream text-left cursor-pointer transition-colors duration-300 ease-[ease] hover:text-gold"
            data-accordion-trigger aria-expanded="false" id="faq-btn-6" aria-controls="faq-panel-6">
            <span>Sunt in culpa qui officia deserunt?</span>
            <span
              class="relative shrink-0 size-6 ml-5 before:absolute before:top-1/2 before:left-1/2 before:w-[18px] before:h-[3px] before:-translate-1/2 before:rounded-[2px] before:bg-blossom before:transition-colors before:duration-300 after:absolute after:top-1/2 after:left-1/2 after:w-[3px] after:h-[18px] after:-translate-1/2 after:rounded-[2px] after:bg-blossom after:transition-all after:duration-300 group-aria-expanded:before:bg-gold group-aria-expanded:after:bg-gold group-aria-expanded:after:rotate-90 group-aria-expanded:after:opacity-0"
              aria-hidden="true"></span>
          </button>
          <div class="max-h-0 overflow-hidden transition-[max-height,padding] duration-400 ease-[ease]" id="faq-panel-6"
            role="region" aria-labelledby="faq-btn-6">
            <p class="px-2 pb-6 text-[0.95rem] leading-[1.75] text-muted-alt">Nam libero tempore, cum soluta nobis est
              eligendi optio cumque nihil impedit
              quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.</p>
          </div>
        </div>
      </div>
    </div>
  </section>


  <!-- ═══════════════════════════════════════════════
       FOOTER — Hack Club Crescent Style
       ═══════════════════════════════════════════════ -->
  <footer class="bg-ink border-t-3 border-subtle pt-16 px-12" id="footer">
    <div class="max-w-content mx-auto flex justify-between items-start gap-12 pb-12">

      <!-- Left column: logo + disclaimer -->
      <div class="flex flex-col gap-3">
        <img src="assets/Alchemize.png" alt="Alchemize Logo" class="w-[240px] h-16 object-contain object-left -mb-3" />
        <p class="text-[0.82rem] leading-[1.65] text-muted-alt max-w-80">
          A Hack Club program. Hack Club is a 501(c)(3) non-profit with a network of more than 100,000 teenagers in 119
          countries, all of them learning by shipping.
        </p>
      </div>

      <!-- Link columns -->
      <nav class="grid grid-cols-[repeat(3,auto)] gap-14" aria-label="Footer navigation">
        <div>
          <h4 class="text-[0.75rem] font-extrabold tracking-[0.12em] uppercase text-blossom mb-5">ALCHEMIZE</h4>
          <ul class="*:mb-3">
            <li><a class="text-[0.9rem] text-muted-alt transition-colors duration-300 ease-[ease] hover:text-cream"
                href="#how-it-works">How it works</a></li>
            <li><a class="text-[0.9rem] text-muted-alt transition-colors duration-300 ease-[ease] hover:text-cream"
                href="#prizes">The shop</a></li>
            <li><a class="text-[0.9rem] text-muted-alt transition-colors duration-300 ease-[ease] hover:text-cream"
                href="#projects">Explore projects</a></li>
            <li><a class="text-[0.9rem] text-muted-alt transition-colors duration-300 ease-[ease] hover:text-cream"
                href="#">The handbook</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-[0.75rem] font-extrabold tracking-[0.12em] uppercase text-blossom mb-5">HACK CLUB</h4>
          <ul class="*:mb-3">
            <li><a class="text-[0.9rem] text-muted-alt transition-colors duration-300 ease-[ease] hover:text-cream"
                href="https://hackclub.com/philosophy" target="_blank" rel="noopener">Philosophy</a></li>
            <li><a class="text-[0.9rem] text-muted-alt transition-colors duration-300 ease-[ease] hover:text-cream"
                href="https://hackclub.com/team" target="_blank" rel="noopener">Team</a></li>
            <li><a class="text-[0.9rem] text-muted-alt transition-colors duration-300 ease-[ease] hover:text-cream"
                href="https://hackclub.com/donate" target="_blank" rel="noopener">Donate</a></li>
            <li><a class="text-[0.9rem] text-muted-alt transition-colors duration-300 ease-[ease] hover:text-cream"
                href="https://hackclub.com/brand" target="_blank" rel="noopener">Branding</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-[0.75rem] font-extrabold tracking-[0.12em] uppercase text-blossom mb-5">HELP</h4>
          <ul class="*:mb-3">
            <li><a class="text-[0.9rem] text-muted-alt transition-colors duration-300 ease-[ease] hover:text-cream"
                href="https://hackclub.com/slack" target="_blank" rel="noopener">#alchemize-help on Slack</a></li>
            <li><a class="text-[0.9rem] text-muted-alt transition-colors duration-300 ease-[ease] hover:text-cream"
                href="mailto:identity@hackclub.com">identity@hackclub.com</a></li>
            <li><a class="text-[0.9rem] text-muted-alt transition-colors duration-300 ease-[ease] hover:text-cream"
                href="#">Fulfilment bounty</a></li>
            <li><a class="text-[0.9rem] text-muted-alt transition-colors duration-300 ease-[ease] hover:text-cream"
                href="https://hackclub.com/conduct" target="_blank" rel="noopener">Code of conduct</a></li>
            <li><a class="text-[0.9rem] text-muted-alt transition-colors duration-300 ease-[ease] hover:text-cream"
                href="https://hackclub.com/privacy" target="_blank" rel="noopener">Privacy &amp; terms</a></li>
          </ul>
        </div>
      </nav>
    </div>

    <div class="max-w-content mx-auto py-6 border-t border-subtle text-center">
      <p class="text-[0.8rem] text-muted-alt tracking-[0.02em]">&copy; 2026 Hack Club. Made by teenagers, mostly at night.
      </p>
    </div>
  </footer>

  

<svelte:head>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js"></script>
  <script src="/js/main.js" defer></script>
</svelte:head>
