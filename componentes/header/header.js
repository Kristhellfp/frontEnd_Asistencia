export const renderHeader = () => {
  const header = document.createElement('header');
  header.classList.add('header');

  const logoContainer = document.createElement('div');
  logoContainer.classList.add('logo-container');

  const logo = document.createElement('img');
  logo.src = 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fstatic.wixstatic.com%2Fmedia%2Fd1b317_4fe70cb66f9447c3991ad4cb8d7294d3~mv2.png%2Fv1%2Ffit%2Fw_2500%2Ch_1330%2Cal_c%2Fd1b317_4fe70cb66f9447c3991ad4cb8d7294d3~mv2.png&f=1&nofb=1&ipt=8c31e43bb42bf88c0aae0e43687cdca27b83aaea369b18da10fd604442b762fa&ipo=images';
  logo.alt = 'Logo de la escuela';
  logo.classList.add('logo');

  logoContainer.appendChild(logo);

  const textContainer = document.createElement('div');
  textContainer.classList.add('text-container');

  const schoolCheckText = document.createElement('h1');
  schoolCheckText.textContent = 'SchoolCheck';
  schoolCheckText.classList.add('school-check-text');

  textContainer.appendChild(schoolCheckText);

  header.appendChild(logoContainer);
  header.appendChild(textContainer);

  return header;
};