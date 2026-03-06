let diseases = []; // será preenchido pelo data.js

document.addEventListener('DOMContentLoaded', () => {
    diseases = window.diseaseData; // vindo do data.js
    renderCards(diseases);

    const searchInput = document.getElementById('search');
    searchInput.addEventListener('input', filterAndRender);

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelector('.filter-btn.active').classList.remove('active');
            btn.classList.add('active');
            filterAndRender();
        });
    });
});

function filterAndRender() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;

    const filtered = diseases.filter(d => {
        const matchesSearch = d.name.toLowerCase().includes(searchTerm) ||
            d.desc.toLowerCase().includes(searchTerm) ||
            d.symptoms.some(s => s.toLowerCase().includes(searchTerm));
        const matchesCategory = activeFilter === 'all' || d.categoryTag === activeFilter;
        return matchesSearch && matchesCategory;
    });

    renderCards(filtered);
}

function renderCards(diseases) {
    const container = document.getElementById('cards-container');
    container.innerHTML = diseases.map(d => `
        <div class="card" onclick="showModal('${d.id}')">
            <h3>${d.name}</h3>
            <span class="category">${d.categoryLabel}</span>
            <p><strong>Resumo:</strong> ${d.desc.substring(0, 100)}...</p>
            <div class="symptoms"><strong>Sintomas:</strong> ${d.symptoms.slice(0, 3).join(', ')}${d.symptoms.length > 3 ? '...' : ''}</div>
        </div>
    `).join('');
}

function showModal(id) {
    const disease = diseases.find(d => d.id === id);
    if (!disease) return;

    const modal = document.getElementById('modal');
    if (!modal) {
        // Criar modal dinamicamente se não existir
        const modalDiv = document.createElement('div');
        modalDiv.id = 'modal';
        modalDiv.className = 'modal';
        modalDiv.innerHTML = `
            <div class="modal-content">
                <span class="close" onclick="closeModal()">&times;</span>
                <div id="modal-body"></div>
            </div>
        `;
        document.body.appendChild(modalDiv);
    }

    document.getElementById('modal-body').innerHTML = `
        <h2>${disease.name}</h2>
        <span class="category">${disease.categoryLabel}</span>
        <h4>Descrição</h4>
        <p>${disease.desc}</p>
        <h4>Causas</h4>
        <p>${disease.cause}</p>
        <h4>Sintomas</h4>
        <p>${disease.symptoms.join(', ')}</p>
        <h4>Tratamento</h4>
        <p>${disease.cure_way ? disease.cure_way.join(', ') : 'Não especificado'}</p>
        <h4>Prevenção</h4>
        <p>${disease.prevent || 'Não disponível'}</p>
        <p><em>Fonte: Dados médicos compilados</em></p>
    `;

    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
