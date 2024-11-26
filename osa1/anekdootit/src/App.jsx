import { useState } from 'react';

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time... The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.',
  ];

  const [selected, setSelected] = useState(0);
  // luodaan taulukko pisteille anecdotes arrayn pituudesta ja alustetaan se nollilla
  const [points, setPoints] = useState(new Array(anecdotes.length).fill(0));

  const handleNextAnecdote = () => {
    // luodaan satunnainen luku anecdotes arrayn pituudesta
    const randomIndex = Math.floor(Math.random() * anecdotes.length);
    // satunnainen luku välitetään setSelected funktiolle, joka päivittää useStaten tilan ja renderöi uuden anekdootin
    setSelected(randomIndex);
  };

  const handleVote = () => {
    // kopioidaan pisteet taulukko
    const copy = [...points];
    // lisätään ääni anekdootille
    copy[selected] += 1;
    // päivitetään äänet
    setPoints(copy);
  };

  // haetaan eniten ääniä saaneen anekdootin indexi
  const highestVotedIndex = points.indexOf(Math.max(...points));
  // haetaan kyseinen anekdootti indexin avulla
  const highestVotedAnecdote = anecdotes[highestVotedIndex];
  // haetaan kyseisen anekdootin pistemäärä indexin avulla
  const highestVotes = points[highestVotedIndex];

  return (
    <div>
      <div>
        <h1>anecdote of the day</h1>
        <button onClick={handleVote}>vote</button>
        <button onClick={handleNextAnecdote}>next anecdote</button>
        <p>{anecdotes[selected]}</p>
        <p>{`votes: ${points[selected]}`}</p>
      </div>

      <div>
        <h1>anecdote with the most votes</h1>
        <p>{highestVotedAnecdote}</p>
        <p>{`votes: ${highestVotes}`}</p>
      </div>
    </div>
  );
};

export default App;
