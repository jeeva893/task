const API = (path) => `${location.origin.replace(/:\d+$/, ':4000')}${path}`;

document.getElementById('search').onclick = async () => {
  const q = document.getElementById('q').value;
  const res = await fetch(API(`/api/search?q=${encodeURIComponent(q)}`));
  const data = await res.json();
  const ul = document.getElementById('results');
  ul.innerHTML = '';
  for (const it of data.items) {
    const li = document.createElement('li');
    li.textContent = `${it.type}: ${it.label}`;
    ul.appendChild(li);
  }
};

document.getElementById('actorSearch').onclick = async () => {
  const name = document.getElementById('actor').value;
  const res = await fetch(API(`/api/actors/${encodeURIComponent(name)}/movies`));
  const data = await res.json();
  const ul = document.getElementById('actorMovies');
  ul.innerHTML = '';
  if (data.movies && data.movies.length) {
    for (const m of data.movies) {
      const li = document.createElement('li');
      li.textContent = `${m.title} (${m.year})`;
      ul.appendChild(li);
    }
  } else {
    ul.textContent = 'No movies found';
  }
};

document.getElementById('reco').onclick = async () => {
  const name = document.getElementById('person').value;
  const res = await fetch(API(`/api/recommendations/${encodeURIComponent(name)}`));
  const data = await res.json();
  const ul = document.getElementById('recoList');
  ul.innerHTML = '';
  if (data.recommendations && data.recommendations.length) {
    for (const r of data.recommendations) {
      const li = document.createElement('li');
      li.textContent = `${r.title} (${r.year}) — co-actors: ${r.coActors.join(', ')}`;
      ul.appendChild(li);
    }
  } else {
    ul.textContent = 'No recommendations';
  }
};
