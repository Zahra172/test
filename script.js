// Theme Management
class ThemeManager {
  constructor() {
    this.theme =
      localStorage.getItem("theme") || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark")
    this.init()
  }

  init() {
    this.setTheme(this.theme)
    this.bindEvents()
  }

  setTheme(theme) {
    this.theme = theme
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem("theme", theme)
    this.updateThemeIcon()
  }

  toggleTheme() {
    const newTheme = this.theme === "dark" ? "light" : "dark"
    this.setTheme(newTheme)
  }

  updateThemeIcon() {
    const themeIcon = document.querySelector(".theme-icon")
    if (themeIcon) {
      themeIcon.textContent = this.theme === "dark" ? "☀️" : "🌙"
    }
  }

  bindEvents() {
    const themeToggle = document.querySelector(".theme-toggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggleTheme())
    }

    // Listen for system theme changes
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
      if (!localStorage.getItem("theme")) {
        this.setTheme(e.matches ? "dark" : "light")
      }
    })
  }
}

// Smooth Scroll Navigation
class SmoothScroll {
  constructor() {
    this.init()
  }

  init() {
    // Handle navigation links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault()
        const target = document.querySelector(anchor.getAttribute("href"))
        if (target) {
          const targetPosition = target.offsetTop - 100

          window.scrollTo({
            top: targetPosition,
            behavior: "smooth",
          })
        }
      })
    })
  }
}

// Intersection Observer for Animations
class AnimationObserver {
  constructor() {
    this.observer = new IntersectionObserver((entries) => this.handleIntersection(entries), {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    })
    this.init()
  }

  init() {
    // Observe all elements with fade-in class
    document.querySelectorAll(".fade-in").forEach((el) => {
      this.observer.observe(el)
    })
  }

  handleIntersection(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        // Stop observing once animated
        this.observer.unobserve(entry.target)
      }
    })
  }
}

// Project Filter System
class ProjectFilter {
  constructor() {
    this.filterButtons = document.querySelectorAll(".filter-btn")
    this.projectCards = document.querySelectorAll(".project-card")
    this.init()
  }

  init() {
    this.filterButtons.forEach((btn) => {
      btn.addEventListener("click", (e) => this.handleFilter(e))
    })
  }

  handleFilter(e) {
    const filterValue = e.target.getAttribute("data-filter")

    // Update active button
    this.filterButtons.forEach((btn) => btn.classList.remove("active"))
    e.target.classList.add("active")

    // Filter projects
    this.projectCards.forEach((card) => {
      const tags = card.getAttribute("data-tags")
      const shouldShow = filterValue === "all" || tags.includes(filterValue)

      if (shouldShow) {
        card.style.display = "block"
        card.style.animation = "fadeIn 0.3s ease forwards"
      } else {
        card.style.display = "none"
      }
    })
  }
}

// Project Modal System
class ProjectModal {
  constructor() {
    this.modal = document.getElementById("projectModal")
    this.modalTitle = document.getElementById("modalTitle")
    this.modalDescription = document.getElementById("modalDescription")
    this.modalTags = document.getElementById("modalTags")
    this.closeBtn = document.querySelector(".modal-close")

    this.projectData = {
      blog: {
        title: "Blog Website",
        description:
          "A comprehensive blog application built with React.js featuring user authentication, form validation using Formik and Yup, and full CRUD operations. The app uses Material UI for a polished interface and Axios for API communication with json-server for backend simulation.",
        tags: ["React.js", "React Router", "Formik", "Yup", "Material UI", "Axios", "json-server", "json-server-auth"],
      },
      cart: {
        title: "Fresh-Cart Website",
        description:
          "A modern e-commerce frontend application showcasing product listings, shopping cart functionality, and responsive design. Built with React.js and styled with Tailwind CSS, featuring efficient data fetching and caching using React Query.",
        tags: ["HTML5", "CSS3", "Tailwind", "React.js", "Context API", "React Query", "API Integration"],
      },
      weather: {
        title: "Weather Website",
        description:
          "A responsive weather application that allows users to search for weather information by city name. Features real-time weather data integration, responsive design with Bootstrap 5, and clean JavaScript implementation for API handling.",
        tags: ["HTML5", "CSS3", "JavaScript", "Bootstrap 5", "Weather API", "Responsive Design"],
      },
    }

    this.init()
  }

  init() {
    // Bind project detail buttons
    document.querySelectorAll(".project-details-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const projectKey = e.target.getAttribute("data-project")
        this.showModal(projectKey)
      })
    })

    // Bind close events
    this.closeBtn.addEventListener("click", () => this.hideModal())
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.hideModal()
    })

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.classList.contains("show")) {
        this.hideModal()
      }
    })
  }

  showModal(projectKey) {
    const project = this.projectData[projectKey]
    if (!project) return

    this.modalTitle.textContent = project.title
    this.modalDescription.textContent = project.description

    // Clear and populate tags
    this.modalTags.innerHTML = ""
    project.tags.forEach((tag) => {
      const tagElement = document.createElement("span")
      tagElement.className = "project-tag"
      tagElement.textContent = tag
      this.modalTags.appendChild(tagElement)
    })

    this.modal.classList.add("show")
    this.modal.setAttribute("aria-hidden", "false")

    // Focus management
    this.closeBtn.focus()
  }

  hideModal() {
    this.modal.classList.remove("show")
    this.modal.setAttribute("aria-hidden", "true")
  }
}

// Contact Form Handler
class ContactForm {
  constructor() {
    this.form = document.getElementById("contactForm")
    this.toast = document.getElementById("toast")
    this.init()
  }

  init() {
    if (this.form) {
      this.form.addEventListener("submit", (e) => this.handleSubmit(e))
    }
  }

  handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData(this.form)
    const name = formData.get("name").trim()
    const email = formData.get("email").trim()
    const message = formData.get("message").trim()

    // Basic validation
    if (!name || !email || !message) {
      this.showToast("Please fill in all fields.", "error")
      return
    }

    if (!this.isValidEmail(email)) {
      this.showToast("Please enter a valid email address.", "error")
      return
    }

    // Simulate form submission (no backend)
    this.showToast("Thank you for your message! I'll get back to you soon.", "success")
    this.form.reset()
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  showToast(message, type = "success") {
    const toastMessage = this.toast.querySelector(".toast-message")
    toastMessage.textContent = message

    // Update toast styling based on type
    this.toast.style.background = type === "error" ? "linear-gradient(135deg, #ef4444, #dc2626)" : "linear-gradient(135deg, #c2185b, #7b1fa2)"

    this.toast.classList.add("show")

    setTimeout(() => {
      this.toast.classList.remove("show")
    }, 4000)
  }
}

// CV Download Handler
class CVDownload {
  constructor() {
    this.init()
  }

  init() {
    // Create a global function for the onclick handler
    window.downloadCV = () => this.handleDownload()
  }

  handleDownload() {
    // Create CV content (you can replace this with actual CV data)
    const cvContent = this.generateCVContent()
    
    // Create blob and download
    const blob = new Blob([cvContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Zahraa_Magdi_CV.txt'
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)

    // Show success toast
    const toast = document.getElementById("toast")
    const toastMessage = toast.querySelector(".toast-message")
    toastMessage.textContent = "CV downloaded successfully!"
    toast.style.background = "linear-gradient(135deg, #c2185b, #7b1fa2)"
    toast.classList.add("show")

    setTimeout(() => {
      toast.classList.remove("show")
    }, 3000)
  }

  generateCVContent() {
    return `ZAHRAA MAGDI
Front-end Developer
Cairo, Egypt

CONTACT INFORMATION
Email: zahramagdi15@gmail.com
Phone: 01013761845
GitHub: github.com/Zahra172
LinkedIn: linkedin.com/in/zahra-magdi17

PROFESSIONAL SUMMARY
A Front-End Developer specialized in building dynamic and responsive web applications using React.js and JavaScript. Experienced in translating UI/UX designs into clean, maintainable code through hands-on personal and training-based projects. Passionate about seamless user experiences and modern development practices.

TECHNICAL SKILLS
Front-End: HTML5, CSS3, JavaScript, React.js, Next.js, Material UI, Tailwind, Bootstrap, Responsive Web Design, Unit Testing, Agile, OOP, Problem Solving
Tools & Tech: Figma, UI/UX, Git, GitHub, Postman, Firebase
Personal: Self-Learning, Adaptability, Innovation, Teamwork, Communication

EXPERIENCE
Information Technology Institute (ITI) — Intensive Training Program (Front-End & Cross-Platform Mobile Development)
02/2025 – 07/2025, Zagazig

ITI — UI/UX Design
07/2022 – 08/2022, Ismaillia

Faculty of Computers and Informatics (SCU) — Front-end development
07/2021 – 08/2021, Ismaillia

EDUCATION
Bachelor in Computer Science and Informatics — Suez Canal University
09/2019 – 07/2023, Ismaillia, Grade: Very Good
Graduation Project: "Hospital system" — Excellent (Role: UI/UX Designer)

COURSES
Route Academy (01/2024 – 07/2024) — HTML5, CSS3, JavaScript (DOM/BOM/Web API), React.js, Bootstrap, Tailwind, AJAX, Material UI, Sass, jQuery

PROJECTS
Blog Website: React.js, React Router, Formik, Yup, Material UI, Axios, json-server, json-server-auth
Fresh-Cart Website: HTML5, CSS3, Tailwind, API, React.js, Context, React Query
Weather Website: HTML5, CSS3, JavaScript, Bootstrap 5, API

LANGUAGES
Arabic — Native/Bilingual
English — Conversational`
  }
}

// Typewriter Effect
class TypewriterEffect {
  constructor(element, text, speed = 100) {
    this.element = element
    this.text = text
    this.speed = speed
    this.index = 0
    this.init()
  }

  init() {
    // Only run if user hasn't disabled animations
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.element.textContent = ""
      this.type()
    }
  }

  type() {
    if (this.index < this.text.length) {
      this.element.textContent += this.text.charAt(this.index)
      this.index++
      setTimeout(() => this.type(), this.speed)
    } else {
      // Remove cursor after typing is complete
      setTimeout(() => {
        this.element.style.borderRight = "none"
      }, 1000)
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize all components
  new ThemeManager()
  new SmoothScroll()
  new AnimationObserver()
  new ProjectFilter()
  new ProjectModal()
  new ContactForm()
  new CVDownload()

  // Initialize typewriter effect for hero subtitle
  const heroSubtitle = document.querySelector(".hero-subtitle")
  if (heroSubtitle) {
    const originalText = heroSubtitle.textContent
    new TypewriterEffect(heroSubtitle, originalText, 150)
  }
})

// Add CSS for animations
const additionalStyles = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    @keyframes techFloat {
        0%, 100% {
            transform: translateY(0px);
        }
        50% {
            transform: translateY(-10px);
        }
    }
    
    @keyframes profileGlow {
        0% {
            box-shadow: 0 20px 40px var(--shadow);
        }
        100% {
            box-shadow: 0 20px 40px var(--shadow), 0 0 30px var(--accent-tertiary);
        }
    }
    
    @keyframes titleGlow {
        0% {
            filter: drop-shadow(0 0 5px var(--accent-primary));
        }
        100% {
            filter: drop-shadow(0 0 15px var(--accent-secondary));
        }
    }
    
    @keyframes float {
        0% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.1;
        }
        25% {
            opacity: 0.2;
        }
        50% {
            transform: translateY(-100px) rotate(180deg);
            opacity: 0.1;
        }
        75% {
            opacity: 0.2;
        }
        100% {
            transform: translateY(0px) rotate(360deg);
            opacity: 0.1;
        }
    }
`

// Inject additional styles
const styleSheet = document.createElement("style")
styleSheet.textContent = additionalStyles
document.head.appendChild(styleSheet)

// Performance optimization: Lazy load images
const lazyLoadImages = () => {
  const images = document.querySelectorAll("img[data-src]")
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.removeAttribute("data-src")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading when DOM is ready
document.addEventListener("DOMContentLoaded", lazyLoadImages)
