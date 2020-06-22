import React, { useState, useEffect, FormEvent } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';

import api from '../../services/api';

interface Repository {
  full_name: string;
  description: string;
  owner: {
    login: string;
    avatar_url: string;
  };
}

const Dashboard: React.FC = () => {
  const [newRepo, setNewRepo] = useState('');
  const [inputError, setInputError] = useState('');
  const [repositories, SetRepositories] = useState<Repository[]>([]);

  const handleAddRepository = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    if (!newRepo) {
      setInputError('Set author/repository name');
      return;
    }

    try {
      const response = await api.get(`repos/${newRepo}`);

      const repository = response.data;
      SetRepositories([...repositories, repository]);
      setNewRepo('');
      setInputError('');
    } catch (err) {
      setInputError('Search repository failed');
    }
  };

  return (
    <>
      <img src={logo} alt="Github" />
      <Title>Explore repositories on Github</Title>
      <Form hasError={!!inputError} onSubmit={handleAddRepository}>
        <input
          type="text"
          placeholder="Search for repository name"
          value={newRepo}
          onChange={(e) => setNewRepo(e.target.value)}
        />
        <button type="submit">Search</button>
      </Form>
      {inputError && <Error>{inputError}</Error>}
      <Repositories>
        {repositories.map((repository) => (
          <a key={repository.full_name} href="tt">
            <img
              src={repository.owner.avatar_url}
              alt={repository.owner.login}
            />
            <div>
              <strong>{repository.full_name}</strong>
              <p>{repository.description}</p>
            </div>

            <FiChevronRight size={20} />
          </a>
        ))}
      </Repositories>
    </>
  );
};

export default Dashboard;
