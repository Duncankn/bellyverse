import React from "react";

export default function Card(props) {
  const basePicUrl =
    "https://dweb.link/ipfs/bafybeicqwokskazdziivvcz5s6xn3qxioica3mowsfvvfcfjk4fogh6dwe/";
  //ipfs://bafybeifk5gubhu3ggt2awyksch6fm4ftwcqiafdkk7qwbtalg7slikjiwa
  // const projectName = "BellyVerse";

  const imageUrl = basePicUrl + props.id + ".png";
  return <img src={imageUrl} alt="example" width="220px" />;
}
