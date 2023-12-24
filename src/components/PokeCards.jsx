/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import styles from "../assets/css/PokeCards.module.css";
import colorTypes from "../assets/PokeTypeColor.json";
import { ModalContext } from "../context/ModalContext";
import bgLogo from "../assets/images/gymLogo.png";
import { Skeleton } from "antd";
import { fourDigitId } from "../utils";

const PokeCards = ({ url }) => {
  const { setChosenPokemon } = useContext(ModalContext);
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pokeTypes, setPokeTypes] = useState([]);
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    const getPokemon = async () => {
      setLoading(true);
      const res = await fetch(url);
      const data = await res.json();
      setPokemonData(data);
      setLoading(false);
    };
    getPokemon();
  }, []);

  useEffect(() => {
    setPokeTypes(pokemonData?.types?.map((type) => type.type.name));
  }, [pokemonData]);

  return (
    <div
      onClick={() => setChosenPokemon(pokemonData.id)}
      className={styles.pokeCard}
      id={fourDigitId(pokemonData.id)}
      style={{
        backgroundColor:
          pokeTypes?.length > 0
            ? `${
                colorTypes.filter((val) => pokeTypes[0] === val.name)[0].color
              }dd`
            : "",
        border:
          pokeTypes?.length > 0
            ? `2px solid ${
                colorTypes.filter((val) => pokeTypes[0] === val.name)[0].color
              }`
            : "",
        boxShadow:
          pokeTypes?.length > 0
            ? `0px 0px 10px ${
                colorTypes.filter((val) => pokeTypes[0] === val.name)[0].color
              }`
            : "",
      }}
    >
      <span className={styles.bgLogo}>
        <img src={bgLogo} alt="pokeLogo" />
      </span>
      <div className={styles.cardContent}>
        {loading ? (
          <Skeleton active={true} />
        ) : (
          <>
            <h4 className={styles.name}>{pokemonData.name}</h4>
            <div className={styles.pokeTypePills}>
              {pokeTypes?.length > 0 &&
                pokeTypes?.map((type) => {
                  return (
                    <span
                      className={styles.pokeTypePill}
                      style={{
                        backgroundColor: colorTypes.filter(
                          (val) => type === val.name
                        )[0].color,
                      }}
                    >
                      {type}
                    </span>
                  );
                })}
            </div>
          </>
        )}
      </div>
      <div className={styles.cardImg}>
        {imgLoading && <Skeleton.Image active={true} />}
        <img
          src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${pokemonData.id}.svg`}
          alt={pokemonData.name}
          onLoad={() => setImgLoading(false)}
          style={{ display: imgLoading ? "none" : "block" }}
        />
      </div>
    </div>
  );
};

export default PokeCards;
