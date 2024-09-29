document.getElementById('runButton').addEventListener('click', () => {
    const selectedOption = document.getElementById('optionSelect').value;
    const content = document.getElementById('contentBox').innerText;
    alert('You selected: ' + selectedOption + '\nDisplayed content: ' + content);
  });
  