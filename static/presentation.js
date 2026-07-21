document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("presentation-mode-toggle");
    if (!toggleBtn) return;

    let isPresentationMode = false;
    let isNavigating = false;
    let navTimeout = null;

    // Helper to get grouped sections based on headers
    const getSections = () => {
        const contentElements = Array.from(document.querySelectorAll("article > *:not(#banner-container):not(#heading):not(#buttons-container):not(nav):not(hr)"));
        const sections = [];
        let currentSection = [];

        contentElements.forEach(el => {
            // If it's a header, start a new section (if we already have elements in the current one)
            if (el.tagName.match(/^H[1-6]$/i) && currentSection.length > 0) {
                sections.push(currentSection);
                currentSection = [];
            }
            currentSection.push(el);
        });
        
        if (currentSection.length > 0) {
            sections.push(currentSection);
        }
        
        // Filter out empty sections (if any) or sections with no height
        return sections.filter(sec => sec.some(el => el.getBoundingClientRect().height > 0));
    };

    toggleBtn.addEventListener("click", (e) => {
        e.preventDefault();
        isPresentationMode = !isPresentationMode;
        document.body.classList.toggle("presentation-mode", isPresentationMode);
        
        if (isPresentationMode) {
            updateActiveElement();
        } else {
            document.querySelectorAll("article .active-element").forEach(el => el.classList.remove("active-element"));
        }
    });

    const updateActiveElement = () => {
        if (!isPresentationMode || isNavigating) return;

        const sections = getSections();
        if (sections.length === 0) return;

        let closestSection = null;
        let minDistance = Infinity;
        const viewportCenterY = window.innerHeight / 2;

        sections.forEach(section => {
            // Find the combined bounding box of the section
            let top = Infinity;
            let bottom = -Infinity;
            
            section.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.height === 0) return;
                if (rect.top < top) top = rect.top;
                if (rect.bottom > bottom) bottom = rect.bottom;
            });

            if (top === Infinity) return; // invisible section

            let distance = 0;
            if (viewportCenterY < top) {
                distance = top - viewportCenterY;
            } else if (viewportCenterY > bottom) {
                distance = viewportCenterY - bottom;
            } else {
                distance = 0;
            }

            if (distance < minDistance) {
                minDistance = distance;
                closestSection = section;
            }
        });

        // If we are at the absolute bottom of the page, force the last section to be active
        // because the browser might not be able to scroll far enough down to center it.
        const isAtBottom = Math.ceil(window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 50;
        if (isAtBottom && sections.length > 0) {
            closestSection = sections[sections.length - 1];
        }

        if (closestSection) {
            // Remove active from all first
            document.querySelectorAll("article .active-element").forEach(el => el.classList.remove("active-element"));
            
            // Add active to all elements in the closest section
            closestSection.forEach(el => el.classList.add("active-element"));
        }
    };

    window.addEventListener("scroll", () => {
        if (isPresentationMode && !isNavigating) {
            window.requestAnimationFrame(updateActiveElement);
        }
    }, { passive: true });

    window.addEventListener("keydown", (e) => {
        if (!isPresentationMode) return;

        const isNext = e.key === "ArrowDown" || e.key === "PageDown" || e.key === " " || e.key === "j";
        const isPrev = e.key === "ArrowUp" || e.key === "PageUp" || e.key === "k";

        if (isNext || isPrev) {
            e.preventDefault();

            const sections = getSections();
            if (sections.length === 0) return;

            // Find index of the currently active section
            const activeIndex = sections.findIndex(section => section.some(el => el.classList.contains("active-element")));
            let targetIndex = 0;

            if (activeIndex !== -1) {
                if (isNext) {
                    targetIndex = Math.min(activeIndex + 1, sections.length - 1);
                } else {
                    targetIndex = Math.max(activeIndex - 1, 0);
                }
            }

            const targetSection = sections[targetIndex];
            
            isNavigating = true;
            clearTimeout(navTimeout);

            // Scroll to center the entire target section vertically
            if (targetSection.length > 0) {
                let top = Infinity;
                let bottom = -Infinity;
                targetSection.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.height === 0) return;
                    if (rect.top < top) top = rect.top;
                    if (rect.bottom > bottom) bottom = rect.bottom;
                });

                if (top !== Infinity) {
                    const sectionHeight = bottom - top;
                    const sectionCenterY = top + sectionHeight / 2;
                    const absoluteCenterY = sectionCenterY + window.scrollY;
                    
                    // If section is taller than viewport, align near the top instead
                    const targetScrollY = sectionHeight > window.innerHeight 
                        ? (top + window.scrollY - 60) 
                        : (absoluteCenterY - window.innerHeight / 2);

                    window.scrollTo({
                        top: targetScrollY,
                        behavior: 'smooth'
                    });
                }
            }
            
            // Instantly apply active classes
            document.querySelectorAll("article .active-element").forEach(el => el.classList.remove("active-element"));
            targetSection.forEach(el => el.classList.add("active-element"));

            navTimeout = setTimeout(() => {
                isNavigating = false;
                updateActiveElement();
            }, 800);
        }
    });
});
