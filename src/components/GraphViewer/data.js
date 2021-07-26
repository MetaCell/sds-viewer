const imgs = ['dataset.svg', 'nifti.svg', 'volume.svg']
.map(src => {
  const img = new Image();
  img.src = `./images/${src}`;
  console.log("Image source ", img.src);
  return img;
});


const sampleData = {
  nodes: [
    { id: 1 , name : "Dataset", img : imgs[0], level : 1 }, 
    { id: 2 , name : " Subject 2", img : imgs[1], level : 2 },
    { id: 3 , name : "Subject 3", img : imgs[1], level : 2 },
    { id: 4 , name : "Subject 4", img : imgs[1], level : 3 },
    { id: 5 , name : "Subject 5", img : imgs[1], level : 3 },
    { id: 6 , name : "File 1", img : imgs[1], level : 3 },
    { id: 7 , name : "File 2", img : imgs[1], level : 3 },
    { id: 8 , name : "File 3", img : imgs[1], level : 4 },
    { id: 9 , name : "File 4", img : imgs[1], level : 4 }
  ],
  links: [
    { source: 1, target: 2},
    { source: 1, target: 3},
    { source: 2, target: 4},
    { source: 2, target: 5},
    { source: 4, target: 8},
    { source: 4, target: 9},
    { source: 3, target: 6},
    { source: 3, target: 7}
  ]
};
  
export const staticGraphData = sampleData;