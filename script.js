// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = '#fff';
        header.style.backdropFilter = 'none';
    }
});

// PDF Upload functionality
document.getElementById('pdfUpload').addEventListener('change', function(e) {
    const files = Array.from(e.target.files);
    const resourcesGrid = document.getElementById('resourcesGrid');
    
    files.forEach(file => {
        if (file.type === 'application/pdf') {
            const resourceItem = createResourceItem(file);
            resourcesGrid.appendChild(resourceItem);
        }
    });
});

function createResourceItem(file) {
    const item = document.createElement('div');
    item.className = 'resource-item';
    
    const fileSize = (file.size / 1024 / 1024).toFixed(2); // Convert to MB
    const uploadDate = new Date().toLocaleDateString();
    
    item.innerHTML = `
        <div class="resource-icon">
            <i class="fas fa-file-pdf" style="color: #dc2626; font-size: 2rem;"></i>
        </div>
        <h4 style="margin: 1rem 0 0.5rem 0; color: #1e293b;">${file.name}</h4>
        <div class="resource-meta" style="color: #64748b; font-size: 0.9rem; margin-bottom: 1rem;">
            <div><i class="fas fa-hdd"></i> ${fileSize} MB</div>
            <div><i class="fas fa-calendar"></i> ${uploadDate}</div>
        </div>
        <div class="resource-actions">
            <button onclick="downloadFile('${file.name}')" class="btn-download">
                <i class="fas fa-download"></i> Download
            </button>
            <button onclick="previewFile('${file.name}')" class="btn" style="background: #f3f4f6; color: #374151; margin-left: 0.5rem;">
                <i class="fas fa-eye"></i> Preview
            </button>
        </div>
    `;
    
    return item;
}

function downloadFile(filename) {
    // In a real implementation, this would download the file
    console.log('Downloading file:', filename);
    alert('Download functionality would be implemented here.');
}

function previewFile(filename) {
    // In a real implementation, this would open a PDF viewer
    console.log('Previewing file:', filename);
    alert('PDF preview functionality would be implemented here.');
}

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.article-card, .contact-card, .resource-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Enhanced keyword search functionality for articles
function setupSearch() {
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
        max-width: 500px;
        margin: 2rem auto;
        position: relative;
    `;
    
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search articles by keywords (e.g., "transformer", "GPT", "attention", "fine-tuning")...';
    searchInput.className = 'search-input';
    searchInput.style.cssText = `
        width: 100%;
        padding: 12px 45px 12px 20px;
        border: 2px solid #e2e8f0;
        border-radius: 25px;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    `;
    
    const searchIcon = document.createElement('i');
    searchIcon.className = 'fas fa-search';
    searchIcon.style.cssText = `
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        color: #64748b;
        pointer-events: none;
    `;
    
    const clearButton = document.createElement('button');
    clearButton.innerHTML = '<i class="fas fa-times"></i>';
    clearButton.className = 'clear-search';
    clearButton.style.cssText = `
        position: absolute;
        right: 45px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        display: none;
        font-size: 14px;
        padding: 5px;
        border-radius: 50%;
        transition: all 0.3s ease;
    `;
    
    const resultsCounter = document.createElement('div');
    resultsCounter.className = 'search-results';
    resultsCounter.style.cssText = `
        text-align: center;
        margin-top: 1rem;
        color: #64748b;
        font-size: 0.9rem;
        display: none;
    `;
    
    // Popular search suggestions
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.className = 'search-suggestions';
    suggestionsContainer.innerHTML = `
        <small style="color: #64748b; margin-right: 1rem;">Popular topics:</small>
    `;
    
    const popularKeywords = [
        'transformer', 'GPT', 'attention', 'fine-tuning', 'BERT', 
        'agents', 'LLM', 'training', 'quantization', 'retrieval'
    ];
    
    popularKeywords.forEach(keyword => {
        const suggestion = document.createElement('span');
        suggestion.className = 'search-suggestion';
        suggestion.textContent = keyword;
        suggestion.addEventListener('click', () => {
            searchInput.value = keyword;
            searchInput.dispatchEvent(new Event('input'));
            searchInput.focus();
        });
        suggestionsContainer.appendChild(suggestion);
    });
    
    searchContainer.appendChild(searchInput);
    searchContainer.appendChild(searchIcon);
    searchContainer.appendChild(clearButton);
    searchContainer.appendChild(resultsCounter);
    searchContainer.appendChild(suggestionsContainer);
    
    const articlesSection = document.querySelector('.articles-section .container');
    const sectionSubtitle = articlesSection.querySelector('.section-subtitle');
    sectionSubtitle.after(searchContainer);
    
    // Enhanced search with multiple keywords and highlighting
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const articles = document.querySelectorAll('.article-card');
        let visibleCount = 0;
        
        // Show/hide clear button
        if (searchTerm) {
            clearButton.style.display = 'block';
        } else {
            clearButton.style.display = 'none';
        }
        
        if (searchTerm === '') {
            articles.forEach(article => {
                article.style.display = 'block';
                article.style.opacity = '1';
                // Remove any existing highlights
                removeHighlights(article);
            });
            resultsCounter.style.display = 'none';
            return;
        }
        
        // Split search terms by spaces and commas
        const keywords = searchTerm.split(/[\s,]+/).filter(word => word.length > 1);
        
        articles.forEach(article => {
            const title = article.querySelector('h3').textContent.toLowerCase();
            const overview = article.querySelector('.article-overview').textContent.toLowerCase();
            const insights = article.querySelector('.article-insights').textContent.toLowerCase();
            const fullText = `${title} ${overview} ${insights}`;
            
            // Check if any keyword matches
            const matches = keywords.some(keyword => 
                fullText.includes(keyword) || 
                fuzzyMatch(keyword, fullText)
            );
            
            if (matches) {
                article.style.display = 'block';
                article.style.opacity = '1';
                article.style.order = '0';
                
                // Highlight matching terms
                highlightKeywords(article, keywords);
                visibleCount++;
            } else {
                article.style.display = 'none';
                removeHighlights(article);
            }
        });
        
        // Show results counter
        resultsCounter.style.display = 'block';
        resultsCounter.textContent = `Found ${visibleCount} article${visibleCount !== 1 ? 's' : ''} matching "${searchTerm}"`;
        
        if (visibleCount === 0) {
            resultsCounter.innerHTML = `
                <div style="color: #ef4444;">
                    No articles found for "${searchTerm}"
                    <br><small>Try keywords like: transformer, GPT, attention, fine-tuning, BERT, training</small>
                </div>
            `;
        }
    });
    
    // Clear search functionality
    clearButton.addEventListener('click', () => {
        searchInput.value = '';
        clearButton.style.display = 'none';
        resultsCounter.style.display = 'none';
        
        const articles = document.querySelectorAll('.article-card');
        articles.forEach(article => {
            article.style.display = 'block';
            article.style.opacity = '1';
            removeHighlights(article);
        });
    });
    
    // Enhanced focus/blur effects
    searchInput.addEventListener('focus', () => {
        searchInput.style.borderColor = '#2563eb';
        searchInput.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
    });
    
    searchInput.addEventListener('blur', () => {
        searchInput.style.borderColor = '#e2e8f0';
        searchInput.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    });
}

// Fuzzy matching for better search results
function fuzzyMatch(keyword, text) {
    // Simple fuzzy matching - allows for minor typos
    if (keyword.length < 3) return false;
    
    const variations = [
        keyword,
        keyword.replace(/er$/, 'ing'), // transformer -> transforming
        keyword.replace(/ing$/, 'er'), // training -> trainer
        keyword.replace(/s$/, ''),     // models -> model
        keyword + 's'                  // model -> models
    ];
    
    return variations.some(variation => text.includes(variation));
}

// Highlight matching keywords in search results
function highlightKeywords(article, keywords) {
    removeHighlights(article); // Remove existing highlights first
    
    const elementsToSearch = [
        article.querySelector('h3'),
        article.querySelector('.article-overview'),
        ...article.querySelectorAll('.article-insights li')
    ];
    
    elementsToSearch.forEach(element => {
        if (!element) return;
        
        let html = element.innerHTML;
        keywords.forEach(keyword => {
            if (keyword.length > 1) {
                const regex = new RegExp(`(${escapeRegex(keyword)})`, 'gi');
                html = html.replace(regex, '<mark style="background: #fef08a; padding: 2px 4px; border-radius: 3px; font-weight: 600;">$1</mark>');
            }
        });
        element.innerHTML = html;
    });
}

// Remove highlights from article
function removeHighlights(article) {
    const marks = article.querySelectorAll('mark');
    marks.forEach(mark => {
        mark.outerHTML = mark.innerHTML;
    });
}

// Escape special regex characters
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Initialize search after DOM is loaded
document.addEventListener('DOMContentLoaded', setupSearch);

// Add loading states for better UX
function showLoading(element) {
    element.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    element.disabled = true;
}

function hideLoading(element, originalText) {
    element.innerHTML = originalText;
    element.disabled = false;
}

// Copy article link functionality
function copyArticleLink(articleTitle) {
    const url = `${window.location.origin}${window.location.pathname}#${articleTitle.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(url).then(() => {
        // Show success message
        showToast('Article link copied to clipboard!');
    });
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add share buttons to articles
document.addEventListener('DOMContentLoaded', () => {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        const actionsDiv = card.querySelector('.article-actions');
        
        const shareButton = document.createElement('button');
        shareButton.innerHTML = '<i class="fas fa-share-alt"></i> Share';
        shareButton.className = 'btn';
        shareButton.style.cssText = `
            background: #f3f4f6;
            color: #374151;
            margin-left: 0.5rem;
            border: 1px solid #d1d5db;
        `;
        
        shareButton.addEventListener('click', () => {
            copyArticleLink(title);
        });
        
        actionsDiv.appendChild(shareButton);
    });
});

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search articles..."]');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

// Print article functionality
function printArticle(articleElement) {
    const printWindow = window.open('', '_blank');
    const article = articleElement.cloneNode(true);
    
    printWindow.document.write(`
        <html>
            <head>
                <title>AI Article - ${article.querySelector('h3').textContent}</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h3 { color: #1e293b; border-bottom: 2px solid #2563eb; padding-bottom: 10px; }
                    .article-insights ul { padding-left: 20px; }
                    .article-insights li { margin-bottom: 10px; }
                    .article-actions { display: none; }
                    .article-icon { display: none; }
                </style>
            </head>
            <body>
                ${article.innerHTML}
            </body>
        </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

// Add print buttons to articles
document.addEventListener('DOMContentLoaded', () => {
    const articleCards = document.querySelectorAll('.article-card');
    
    articleCards.forEach(card => {
        const actionsDiv = card.querySelector('.article-actions');
        
        const printButton = document.createElement('button');
        printButton.innerHTML = '<i class="fas fa-print"></i>';
        printButton.className = 'btn';
        printButton.style.cssText = `
            background: #f3f4f6;
            color: #374151;
            margin-left: 0.5rem;
            border: 1px solid #d1d5db;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        printButton.title = 'Print Article';
        
        printButton.addEventListener('click', () => {
            printArticle(card);
        });
        
        actionsDiv.appendChild(printButton);
    });
});