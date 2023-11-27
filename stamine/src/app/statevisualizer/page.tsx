
'use client';
import React, { useEffect, useState } from 'react';
import cytoscape from 'cytoscape';
import "./style.css";

const StateVisualizer = () => {
    const [cy, setCy] = useState(null);
    const [nodeValue, setNodeValue] = useState<string>('');


    let initialTransition = {
        "nodes": ["1", "2", "3"],
        "edges": [("1", "2", "a"), ("2", "3", "b")]
    };

    const [transitions, setTransitions] = useState(initialTransition);

    useEffect(() => {
        // Initialize Cytoscape
        const newCy = cytoscape({
            container: document.getElementById('cy'),
            elements: [
                // nodes
                { data: { id: 'head-1', label: '1' } },
                { data: { id: 'item-2', label: '2' } },
                { data: { id: 'item-3', label: '3' } },

                // edges
                { data: { id: 'edge-1', label: 'bcd', source: 'head-1', target: 'item-2' } },
                { data: { id: 'edge-2', label: 'asd', source: 'item-2', target: 'item-3' } },
            ],
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

        newCy.nodes().ungrabify();
        setCy(newCy);
        // Function to handle resize
        const handleResize = () => {
            newCy.resize();
            applyTreeLayout(newCy);
        };

        // Add event listener for resize
        window.addEventListener('resize', handleResize);

        // Apply initial layout
        applyTreeLayout(newCy);

        // Remove event listener on cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            newCy.destroy();
        };
    }, []);

    // Function to layout nodes in a horizontal line
    const applyTreeLayout = (cyInstance) => {
        const nodes = cyInstance.nodes();
        const containerWidth = cyInstance.container().offsetWidth;
        const containerHeight = cyInstance.container().offsetHeight;
        let depth = 1;

        nodes.forEach((cur) => {

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
                            Current Transitions
                        </p>
                    </div>
                </div>
                <div className="halfChild">
                    <p> Add to transition function </p>
                    <form id="yourFormId">
                        <label htmlFor="inputField">States</label>
                        <input type="text" id="inputField" name="inputField" required/>
                        <label htmlFor="inputField">Transitions</label>
                        <input type="text" id="inputField" name="inputField" required/>
                        <button type={"submit"}>Submit new changes</button>
                    </form>
                </div>
            </div>

            <div class="code">
                <p class="biggerText"> Current code </p>
                <form id="currentCode" onSubmit={(e) => e.preventDefault()}>
                    <input type="text" id="inputField" name="inputField"/>
                    <button type={"submit"}>Visualize Changes</button>
                </form>
            </div>
        </div>
    )
};
export default StateVisualizer;