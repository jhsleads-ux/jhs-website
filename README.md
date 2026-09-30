# JHS Premium React Website

A local React/Vite multi-page school website for Jain Heritage School, Belagavi.

## Design direction
- Editorial / architecture-inspired layout influenced by MH Design Build.
- Cinematic scroll-driven hero inspired by the supplied interior-design101 portfolio reference.
- JHS-inspired green, blue, purple and yellow visual language.
- Sticky navigation with multi-level dropdown menus.
- Native browser scrolling; no scroll-jacking library.
- Hero video progress is driven by scroll with requestAnimationFrame interpolation.

## Menu / routes
Home
About Us -> Chairman Message, At a Glance, Infrastructure, Library
Admissions -> Eligibility, Schedule Interview, Documents Required
Academics
Student Life -> Awards and Honors, School Anthem, Life Skills, Infinitum Vyoma, Food Menu
Gallery -> Photos & Videos
News -> Events & Calendar
Disclosure
Blogs
FAQ
Contact Us

## Run
npm install
npm run dev

Open http://localhost:5173

## Hero video
Replace public/videos/jhs-hero.mp4 with your optimized 5–8 second H.264 hero video. For smoother scrubbing, use frequent keyframes and `-movflags +faststart` when encoding.

## Content note
The copy is based on publicly visible JHS website material retrieved during development. Where a specific source subpage could not be reliably retrieved, the page uses a structured, editable content block rather than inventing an official document or exact wording. Replace those blocks with the school's approved current text/PDFs before production.
