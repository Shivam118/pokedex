/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from "react";
import { Badge, Modal, Skeleton } from "antd";
import styles from "../assets/css/PokeModals.module.css";
import { ModalContext } from "../context/ModalContext";
import { fourDigitId } from "../utils";

const PokeModals = () => {
  const { modalScreen, setModalScreen, chosenPokemon } =
    useContext(ModalContext);
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imgLoading, setImgLoading] = useState(true);
  const [pokeStats, setPokeStats] = useState([]);

  const getPokemon = async () => {
    setLoading(true);
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${chosenPokemon}`
    );
    const data = await res.json();
    setPokemonData(data);
    const stats = [];
    data?.stats?.forEach((stat) => {
      stats.push({ stat: stat.stat.name, base_stat: stat.base_stat });
    });
    setPokeStats(stats);
    setLoading(false);
  };

  useEffect(() => {
    getPokemon();
  }, [chosenPokemon]);

  return (
    <Badge.Ribbon text={fourDigitId(chosenPokemon)}>
      <Modal
        open={modalScreen}
        footer={null}
        onCancel={() => setModalScreen(false)}
      >
        {loading ? (
          <Skeleton active={true} />
        ) : (
          <>
            <h1 className={styles.name}>{`${pokemonData.name} (${fourDigitId(
              pokemonData.id
            )})`}</h1>
            <br />
            <div className={styles.card}>
              <div className={styles.modalImg}>
                {imgLoading && (
                  <>
                    <Skeleton.Image active={true} />
                  </>
                )}
                <img
                  src={`https://unpkg.com/pokeapi-sprites@2.0.2/sprites/pokemon/other/dream-world/${pokemonData.id}.svg`}
                  alt={pokemonData.name}
                  onLoad={() => setImgLoading(false)}
                  style={{ display: imgLoading ? "none" : "block" }}
                />
              </div>
              <table className={styles.modalContent}>
                <tbody>
                  {pokeStats?.map((stat, index) => (
                    <tr key={index}>
                      <td>{stat.stat}</td>
                      <td>
                        <progress
                          min="0"
                          max="225"
                          value={stat.base_stat}
                          className={`${styles.progress} 
                      ${
                        parseInt(stat.base_stat) <= 45
                          ? styles.one
                          : parseInt(stat.base_stat) <= 90
                          ? styles.two
                          : parseInt(stat.base_stat) <= 135
                          ? styles.three
                          : parseInt(stat.base_stat) <= 180
                          ? styles.four
                          : styles.five
                      }`}
                        />
                        {/* <Progress percent={stat.base_stat} showInfo={false} /> */}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Modal>
    </Badge.Ribbon>
  );
};

export default PokeModals;
