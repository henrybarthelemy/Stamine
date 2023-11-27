
// noinspection TypeScriptValidateTypes

'use client';
import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import "./style.css";

const StateVisualizer = () => {
    const DELTA_SYMBOL = "ẟ";
    const [cy, setCy] = useState(null);
    const [nodeValue, setNodeValue] = useState<string>('');

    let initialTransition = {
        "nodes": ["5", "6", "7"],
        "edges": [["5", "6", "a"], ["6", "7", "b"]]
    };
    const [transitions, setTransitions] = useState(initialTransition);
    const [code, setCode] = useState(transformToCode(initialTransition));

    function transformToCode(dTransition) {

    }

    useEffect(() => {
        // Initialize Cytoscape
        const newCy = cytoscape({
            container: document.getElementById('cy'),
            style: [
                {
                    selector: 'node:active',
                    style: {
                        'overlay-padding': 0,
                        'overlay-color': 'transparent',
                        'overlay-opacity': 0,
                    }
                },
                {
                    selector: 'node:selected',
                    style: {
                        'border-width': 0,
                        'overlay-padding': 0,
                        'overlay-color': 'transparent',
                        'overlay-opacity': 0,
                    }
                },
                {
                    selector: 'node',
                    style: {
                        'shape': 'round-rectangle',
                        'background-color': '#666',
                        'label': 'data(label)',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'overlay-opacity': 0,
                        'border-width': 0,
                        'width': 50,
                        'height': 50,
                        'cursor': 'default'
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'label': 'data(label)',
                        'width': 3,
                        'line-color': '#ccc',
                        'overlay-padding': 0,
                        'overlay-color': 'transparent',
                        'overlay-opacity': 0,
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier',
                        'target-arrow-color': '#ccc'
                    }
                },
                {
                    selector: 'core',
                    style: {
                        'active-bg-opacity': 0,
                        'active-bg-color': 'transparent',
                        'active-bg-size': 0,
                    }
                }
            ],
            layout: {
                name: 'grid',
                fit: true
            },
            // Interaction options
            userZoomingEnabled: false,
            userPanningEnabled: false,
            boxSelectionEnabled: false,
        });
        newCy.add(mapToElements(transitions));
        newCy.nodes().ungrabify();

        setCy(newCy);
        // Function to handle resize
        const handleResize = () => {
            newCy.resize();
            applyHorizontalLayout(newCy);
        };

        // Add event listener for resize
        window.addEventListener('resize', handleResize);

        // Apply initial layout
        applyHorizontalLayout(newCy);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            newCy.destroy();
        };
    }, []);



    // Preprocesses the json to cytoscape format
    const mapToElements = (transitionState) => {
        let nodes = transitionState.nodes;
        let edges = transitionState.edges;
        let elements = [];
        // Adds each nodes to the elements
        nodes.forEach(node => {
            let data = { id: 'item-'+node, label: node };
            elements.push({data: data});
        })
        edges.forEach(edge => {
            let data = {
                id: "edge-"+edge[0]+"-"+edge[1]+"-"+edge[2],
                label: edge[2],
                source: "item-"+edge[0],
                target: "item-"+edge[1]
            }
            elements.push({data: data});
        });
        return elements;
    }

    // Function to layout nodes in a horizontal line
    // Function to layout nodes in a horizontal line
    const applyHorizontalLayout = (cyInstance) => {
        const nodes = cyInstance.nodes();
        const containerWidth = cyInstance.container().offsetWidth;
        const containerHeight = cyInstance.container().offsetHeight;
        const nodeWidth = 50; // Fixed node width
        const spacing = containerWidth / (nodes.length + 1); // Calculate spacing based on container width and node count

        nodes.positions((node, index) => {
            let x = spacing * (index + 1); // Calculate x position with equal spacing
            if (nodes.length === 1) {
                x = containerWidth / 2; // Center the node if it's the only one
            }
            return {
                x,
                y: containerHeight / 2 // Center y position
            };
        });

        // Instead of fit, manually set zoom and pan
        if (nodes.length === 1) {
            // If only one node, center it without zooming in
            cyInstance.zoom({
                level: 1, // Set the zoom level to 1 (or any appropriate level)
                renderedPosition: { x: containerWidth / 2, y: containerHeight / 2 }
            });
        } else {
            // If more than one node, fit them to the screen with padding
            cyInstance.fit(nodes, 50); // Include 50 pixels of padding
        }

        cyInstance.center(nodes); // Center the nodes in the viewport
    };
    function generateEdgeListFromTransitions() {
        return transitions.edges.map((edge, index) => {
            const [source, target, label] = edge;
            return (
                <p key={index}>
                    {`${DELTA_SYMBOL}(${source}, ${label}) = ${target}`}
                </p>
            );
        });
    }
    //"edges": [["5", "6", "a"], ["6", "7", "b"]] -> "ẟ(5, a) = 6 \nẟ(6, b) = 7"

    return (
        <div>
            <div className="title">
                <p>Stamine</p>
            </div>

            <div className="cyContainer">
                <div id='cy' className="bg-blue-500" />
            </div>

            <div className="fullParent">
                <div className="halfChild">
                    <div className="description">
                        <p>
                            How transitions work....
                        </p>
                    </div>
                </div>
                <div className="halfChild">
                    <p class="biggerText"> Current state diagram </p>
                    <p class="mediumText">States</p>
                    <p> {transitions.nodes.join(', ')} </p>
                    <p class="mediumText">Transitions</p>
                    {generateEdgeListFromTransitions()}
                </div>
            </div>

            <div class="code">
                <p class="biggerText"> Current code </p>
                <form id="currentCode" onSubmit={(e) => e.preventDefault()}>
                    <textarea type="text" id="codeTextArea" name="inputField"/>
                    <button class="buttonSubmit" type={"submit"}>Visualize Changes</button>
                </form>
            </div>
        </div>
    )
};
export default StateVisualizer;