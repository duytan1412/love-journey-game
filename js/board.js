/**
 * 💕 LOVE JOURNEY - Board Renderer
 * Renders tiles along SVG curved paths
 */

class BoardRenderer {
    constructor() {
        this.tilesLayer = document.getElementById('tiles-layer');
        this.playersLayer = document.getElementById('players-layer');

        // Path configurations
        this.lane1Path = document.getElementById('lane1-path');
        this.lane2Path = document.getElementById('lane2-path');

        // Number of tiles per lane (30 tiles for longer gameplay)
        this.tilesPerLane = 30; // 0 = start, 1-28 = tiles, 29 = finish

        // Tile positions along path (as percentage 0-1)
        this.tilePositions = [];

        // Intersection positions (where lanes cross) - at ~25%, 50%, 75%
        this.intersectionIndices = [7, 15, 22]; // Tile indices that are intersections

        // HARDCODED INTERSECTION COORDINATES (must match SVG)
        this.INTERSECTIONS = {
            7: { x: 900, y: 500 },
            15: { x: 1800, y: 500 },
            22: { x: 2700, y: 500 }
        };

        // Tile size (optimized to prevent overlap)
        this.tileSize = 32;

        // Store tile elements for reference
        this.tiles = {
            lane1: [],
            lane2: []
        };

        // Store tile CENTER coordinates for piece positioning
        this.tileCenters = {
            lane1: [],
            lane2: []
        };

        // Player marker elements
        this.playerMarkers = {};

        // Store generated tile types per game session
        this.currentTileTypes1 = null;
        this.currentTileTypes2 = null;
    }

    /**
     * Initialize the board
     */
    init() {
        this.calculateTilePositions();
        this.tilesLayer.innerHTML = ''; // Clear before rendering

        // Generate fresh tile types for this game (randomized)
        this.currentTileTypes1 = this.generateTileTypes();
        this.currentTileTypes2 = this.generateTileTypes(this.currentTileTypes1);

        this.renderTiles(); // Segment-style tiles
        this.renderPlayerMarkers();
    }

    /**
     * Calculate positions along the path for each tile
     */
    calculateTilePositions() {
        for (let i = 0; i < this.tilesPerLane; i++) {
            this.tilePositions.push(i / (this.tilesPerLane - 1));
        }
    }

    /**
     * Get point on SVG path at percentage
     */
    getPointOnPath(path, percentage) {
        const length = path.getTotalLength();
        const point = path.getPointAtLength(length * percentage);
        return { x: point.x, y: point.y };
    }

    /**
     * Render board game style path segments (colored rectangles forming the path)
     */
    renderPathSegments() {
        const numSegments = this.tilesPerLane;
        const segmentColors = {
            romance: '#ff6b9d',  // Pink
            deep: '#667eea',     // Blue
            fun: '#f7b731',      // Orange/Yellow
            intimate: '#a55eea', // Purple
            dare: '#ff4757',     // Red
            start: '#2ed573',    // Green
            finish: '#ffd700',   // Gold
            overlap: '#00d9ff',  // Cyan
            bonus: '#ffd700',    // Gold
            pause: '#ff9f43',    // Orange
            swap: '#5f27cd'      // Deep Purple
        };

        const tileTypes = this.generateTileTypes();

        // Create path segments for Lane 1
        this.createLaneSegments(this.lane1Path, tileTypes, segmentColors, 1);

        // Create path segments for Lane 2
        this.createLaneSegments(this.lane2Path, tileTypes, segmentColors, 2);
    }

    /**
     * Create colored segments along a lane path
     */
    createLaneSegments(path, tileTypes, colors, laneNum) {
        const length = path.getTotalLength();
        const segmentLength = length / (this.tilesPerLane - 1);

        for (let i = 0; i < this.tilesPerLane - 1; i++) {
            const percentage1 = i / (this.tilesPerLane - 1);
            const percentage2 = (i + 1) / (this.tilesPerLane - 1);

            const point1 = path.getPointAtLength(length * percentage1);
            const point2 = path.getPointAtLength(length * percentage2);

            // Calculate segment center and angle
            const centerX = (point1.x + point2.x) / 2;
            const centerY = (point1.y + point2.y) / 2;
            const angle = Math.atan2(point2.y - point1.y, point2.x - point1.x) * 180 / Math.PI;
            const segLen = Math.hypot(point2.x - point1.x, point2.y - point1.y);

            // Create segment rectangle
            const segmentType = tileTypes[i];
            const color = colors[segmentType] || '#667eea';

            // Offset for lane separation
            const offsetY = laneNum === 1 ? -20 : 20;
            const perpAngle = (angle + 90) * Math.PI / 180;
            const offsetX = Math.cos(perpAngle) * offsetY;
            const realOffsetY = Math.sin(perpAngle) * offsetY;

            // Skip if this is an intersection tile (they share the same space)
            if (this.intersectionIndices.includes(i) && laneNum === 2) continue;

            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.setAttribute('x', -segLen / 2);
            rect.setAttribute('y', -15);
            rect.setAttribute('width', segLen + 2); // Slight overlap to avoid gaps
            rect.setAttribute('height', 30);
            rect.setAttribute('rx', '4');
            rect.setAttribute('ry', '4');
            rect.setAttribute('fill', color);
            rect.setAttribute('stroke', 'rgba(255,255,255,0.3)');
            rect.setAttribute('stroke-width', '2');
            rect.setAttribute('transform', `translate(${centerX + offsetX}, ${centerY + realOffsetY}) rotate(${angle})`);
            rect.classList.add('path-segment', segmentType);

            this.tilesLayer.appendChild(rect);
        }
    }

    /**
     * Render all tiles as connected rectangular segments (board game style)
     */
    renderTiles() {
        // Use pre-generated tile types (created fresh on init)
        const tileTypes = this.currentTileTypes1;
        const tileTypes2 = this.currentTileTypes2;

        // Track lane paths for correct positioning
        const laneWidth = 45; // Half-width of lane track stroke (wider now)
        const GAP = 150; // Very large gap from intersection tiles to prevent overlap

        const getTilePos = (path, index) => {
            if (this.INTERSECTIONS[index]) return this.INTERSECTIONS[index];
            return this.getPointOnPath(path, this.tilePositions[index]);
        };

        // Clear tile centers
        this.tileCenters.lane1 = [];
        this.tileCenters.lane2 = [];

        // Helper: check if index is adjacent to intersection
        const isAdjacentToIntersection = (idx) => {
            return this.intersectionIndices.includes(idx - 1) ||
                this.intersectionIndices.includes(idx + 1);
        };

        // Render Lane 1 tiles
        for (let i = 0; i < this.tilesPerLane; i++) {
            const pos = getTilePos(this.lane1Path, i);
            let nextPos = i < this.tilesPerLane - 1
                ? getTilePos(this.lane1Path, i + 1)
                : pos;

            const isIntersection = this.intersectionIndices.includes(i);
            const nextIsIntersection = this.intersectionIndices.includes(i + 1);
            const prevIsIntersection = this.intersectionIndices.includes(i - 1);

            // 1. If intersection, Create Square (The "Tile")
            if (isIntersection) {
                const tile = this.createSegmentTile(i, pos, nextPos, tileTypes[i], 1, true, false, laneWidth);
                this.tilesLayer.appendChild(tile);
                this.tiles.lane1.push(tile);
                // Store intersection center
                this.tileCenters.lane1.push({ x: pos.x, y: pos.y });
            }

            // 2. Create Segment (connecting i -> i+1)
            // DON'T render segment if BOTH ends are near intersections (would be too small)
            if (i < this.tilesPerLane - 1 && !(isIntersection && nextIsIntersection)) {
                let startPoint = { ...pos };
                let endPoint = { ...nextPos };

                let segmentType = tileTypes[i];

                // Gap at START if this tile is intersection (leaving intersection)
                if (isIntersection) {
                    const dx = nextPos.x - pos.x;
                    const dy = nextPos.y - pos.y;
                    const angle = Math.atan2(dy, dx);
                    startPoint.x += Math.cos(angle) * GAP;
                    startPoint.y += Math.sin(angle) * GAP;

                    // Use next tile's type for this segment
                    segmentType = tileTypes[i + 1];
                }

                // Gap at END if next tile is intersection (entering intersection)
                if (nextIsIntersection) {
                    const dx = nextPos.x - pos.x;
                    const dy = nextPos.y - pos.y;
                    const angle = Math.atan2(dy, dx);
                    endPoint.x -= Math.cos(angle) * GAP;
                    endPoint.y -= Math.sin(angle) * GAP;
                }

                // Check if segment is long enough to render
                const segDist = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
                if (segDist > 30) { // Only render if segment has meaningful length
                    const segment = this.createSegmentTile(i, startPoint, endPoint, segmentType, 1, false, nextIsIntersection, laneWidth);
                    this.tilesLayer.appendChild(segment);

                    // If NOT intersection, this segment IS the tile reference
                    if (!isIntersection) {
                        this.tiles.lane1.push(segment);
                        // Store segment center for piece positioning
                        const cx = (startPoint.x + endPoint.x) / 2;
                        const cy = (startPoint.y + endPoint.y) / 2;
                        this.tileCenters.lane1.push({ x: cx, y: cy });
                    }
                } else if (!isIntersection) {
                    // Create placeholder for tile reference
                    this.tiles.lane1.push(null);
                    // Use path position as fallback center
                    this.tileCenters.lane1.push({ x: pos.x, y: pos.y });
                }
            } else if (i < this.tilesPerLane - 1 && !isIntersection) {
                this.tiles.lane1.push(null);
                // Use path position as fallback center
                this.tileCenters.lane1.push({ x: pos.x, y: pos.y });
            }
        }

        // Render Lane 2 tiles
        for (let i = 0; i < this.tilesPerLane; i++) {
            const pos = getTilePos(this.lane2Path, i);
            let nextPos = i < this.tilesPerLane - 1
                ? getTilePos(this.lane2Path, i + 1)
                : pos;

            const isIntersection = this.intersectionIndices.includes(i);
            const nextIsIntersection = this.intersectionIndices.includes(i + 1);
            const prevIsIntersection = this.intersectionIndices.includes(i - 1);

            // 1. If intersection, Reuse Lane 1 Square (and center)
            if (isIntersection) {
                this.tiles.lane2.push(this.tiles.lane1[i]);
                this.tileCenters.lane2.push({ x: pos.x, y: pos.y });
            }

            // 2. Create Segment (Lane 2 path)
            if (i < this.tilesPerLane - 1 && !(isIntersection && nextIsIntersection)) {
                let startPoint = { ...pos };
                let endPoint = { ...nextPos };

                let segmentType = tileTypes2[i];

                if (isIntersection) {
                    const dx = nextPos.x - pos.x;
                    const dy = nextPos.y - pos.y;
                    const angle = Math.atan2(dy, dx);
                    startPoint.x += Math.cos(angle) * GAP;
                    startPoint.y += Math.sin(angle) * GAP;

                    segmentType = tileTypes2[i + 1];
                }

                if (nextIsIntersection) {
                    const dx = nextPos.x - pos.x;
                    const dy = nextPos.y - pos.y;
                    const angle = Math.atan2(dy, dx);
                    endPoint.x -= Math.cos(angle) * GAP;
                    endPoint.y -= Math.sin(angle) * GAP;
                }

                const segDist = Math.hypot(endPoint.x - startPoint.x, endPoint.y - startPoint.y);
                if (segDist > 30) {
                    const segment = this.createSegmentTile(i, startPoint, endPoint, segmentType, 2, false, nextIsIntersection, laneWidth);
                    this.tilesLayer.appendChild(segment);

                    if (!isIntersection) {
                        this.tiles.lane2.push(segment);
                        // Store segment center for piece positioning
                        const cx = (startPoint.x + endPoint.x) / 2;
                        const cy = (startPoint.y + endPoint.y) / 2;
                        this.tileCenters.lane2.push({ x: cx, y: cy });
                    }
                } else if (!isIntersection) {
                    this.tiles.lane2.push(null);
                    this.tileCenters.lane2.push({ x: pos.x, y: pos.y });
                }
            } else if (i < this.tilesPerLane - 1 && !isIntersection) {
                this.tiles.lane2.push(null);
                this.tileCenters.lane2.push({ x: pos.x, y: pos.y });
            }
        }
    }

    /**
     * Create a segment-style tile (rectangle centered ON the lane path)
     */
    createSegmentTile(index, pos1, pos2, type, lane, isIntersection, nextIsIntersection, laneWidth) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('tile-group');
        group.dataset.index = index;
        group.dataset.lane = lane;
        group.dataset.type = type;

        // For intersection tiles: smaller square at crossing point
        if (isIntersection) {
            const squareSize = 60; // Further reduced to prevent overlap

            // Create square at exact position (pos1 is the crossing point)
            const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            rect.classList.add('tile-bg', type);
            rect.setAttribute('x', pos1.x - squareSize / 2);
            rect.setAttribute('y', pos1.y - squareSize / 2);
            rect.setAttribute('width', squareSize);
            rect.setAttribute('height', squareSize);
            rect.setAttribute('rx', '10');
            rect.setAttribute('ry', '10');

            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.classList.add('tile-text');
            text.setAttribute('x', pos1.x);
            text.setAttribute('y', pos1.y);
            text.textContent = this.getTileLabel(index, type);

            group.appendChild(rect);
            group.appendChild(text);
            return group;
        }

        // For regular tiles: rectangular segment along path
        const centerX = (pos1.x + pos2.x) / 2;
        const centerY = (pos1.y + pos2.y) / 2;
        const angle = Math.atan2(pos2.y - pos1.y, pos2.x - pos1.x) * 180 / Math.PI;

        // Calculate segment length based on distance to next tile
        const rawLength = Math.hypot(pos2.x - pos1.x, pos2.y - pos1.y);

        // Make segments smaller to prevent overlap
        const lengthFactor = nextIsIntersection ? 0.30 : 0.40;
        const segmentLength = Math.max(rawLength * lengthFactor, 30);
        const segmentHeight = 35; // Compact height to prevent overlap

        // Create segment rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.classList.add('tile-bg', type);
        rect.setAttribute('x', -segmentLength / 2);
        rect.setAttribute('y', -segmentHeight / 2);
        rect.setAttribute('width', segmentLength);
        rect.setAttribute('height', segmentHeight);
        rect.setAttribute('rx', '6');
        rect.setAttribute('ry', '6');
        rect.setAttribute('transform', `translate(${centerX}, ${centerY}) rotate(${angle})`);

        // Create tile text/icon at center
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.classList.add('tile-text');
        text.setAttribute('x', centerX);
        text.setAttribute('y', centerY);
        text.textContent = this.getTileLabel(index, type);

        group.appendChild(rect);
        group.appendChild(text);

        return group;
    }

    /**
     * Generate tile types array (randomized each game)
     */
    generateTileTypes(avoidTypes = null) {
        const baseTypes = ['romance', 'deep', 'fun', 'intimate', 'dare'];
        const specialPositions = { 5: 'bonus', 12: 'pause', 25: 'swap' };
        const trapPositions = { 9: 'trap_back', 17: 'trap_skip', 24: 'trap_spin' };
        const tiles = [];

        // First pass: identify all normal tile positions
        const normalPositions = [];
        for (let i = 0; i < this.tilesPerLane; i++) {
            if (i === 0 || i === this.tilesPerLane - 1 ||
                this.intersectionIndices.includes(i) || specialPositions[i] || trapPositions[i]) {
                continue;
            }
            normalPositions.push(i);
        }

        // Create array of types for normal positions (cycling through base types)
        const normalTypes = [];
        for (let i = 0; i < normalPositions.length; i++) {
            normalTypes.push(baseTypes[i % baseTypes.length]);
        }

        // Fisher-Yates shuffle for randomized tile colors
        for (let i = normalTypes.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [normalTypes[i], normalTypes[j]] = [normalTypes[j], normalTypes[i]];
        }

        // Second pass: build final tiles array
        let normalIndex = 0;
        for (let i = 0; i < this.tilesPerLane; i++) {
            if (i === 0) {
                tiles.push('start');
            } else if (i === this.tilesPerLane - 1) {
                tiles.push('finish');
            } else if (this.intersectionIndices.includes(i)) {
                tiles.push('overlap');
            } else if (specialPositions[i]) {
                tiles.push(specialPositions[i]);
            } else if (trapPositions[i]) {
                tiles.push(trapPositions[i]);
            } else {
                let type = normalTypes[normalIndex++];
                // ALWAYS ensure Lane 2 tiles are different from Lane 1 at same position
                if (avoidTypes && avoidTypes[i] && baseTypes.includes(avoidTypes[i])) {
                    // Get all types except the one to avoid
                    const allowedTypes = baseTypes.filter(t => t !== avoidTypes[i]);
                    // If current type matches the one to avoid, pick a random different one
                    if (type === avoidTypes[i]) {
                        type = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
                    }
                }
                tiles.push(type);
            }
        }

        return tiles;
    }

    /**
     * Create a single tile SVG group
     */
    createTile(index, position, type, lane) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('tile-group');
        group.dataset.index = index;
        group.dataset.lane = lane;
        group.dataset.type = type;

        // Offset for lane separation (except at intersections)
        let offsetY = 0;
        if (!this.intersectionIndices.includes(index) && index !== 0 && index !== this.tilesPerLane - 1) {
            offsetY = lane === 1 ? -12 : 12;
        }

        // Create tile background
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.classList.add('tile-bg', type);
        rect.setAttribute('x', position.x - this.tileSize / 2);
        rect.setAttribute('y', position.y + offsetY - this.tileSize / 2);
        rect.setAttribute('width', this.tileSize);
        rect.setAttribute('height', this.tileSize);
        rect.setAttribute('rx', '5');
        rect.setAttribute('ry', '5');

        // Create tile text/icon
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.classList.add('tile-text');
        text.setAttribute('x', position.x);
        text.setAttribute('y', position.y + offsetY);
        text.textContent = this.getTileLabel(index, type);

        group.appendChild(rect);
        group.appendChild(text);

        return group;
    }

    /**
     * Get tile label/icon
     */
    getTileLabel(index, type) {
        const icons = {
            start: '🏠',
            finish: '🏁',
            overlap: '💑',
            bonus: '⭐',
            pause: '⏸️',
            swap: '🔄',
            trap_back: '🕳️',
            trap_skip: '⏭️',
            trap_spin: '🎰'
        };

        if (icons[type]) return icons[type];
        return index.toString();
    }

    /**
     * Render player markers
     */
    renderPlayerMarkers() {
        this.playersLayer.innerHTML = '';

        // Player 1 marker
        const p1 = this.createPlayerMarker(1);
        this.playersLayer.appendChild(p1);
        this.playerMarkers.p1 = p1;

        // Player 2 marker
        const p2 = this.createPlayerMarker(2);
        this.playersLayer.appendChild(p2);
        this.playerMarkers.p2 = p2;

        // Position at start
        this.updatePlayerPosition(1, 0);
        this.updatePlayerPosition(2, 0);
    }

    /**
     * Create player marker SVG - distinctive male/female figures
     */
    createPlayerMarker(player) {
        const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        group.classList.add('player-marker-svg', player === 1 ? 'p1' : 'p2');

        // Larger base circle (head)
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('r', '32');
        circle.setAttribute('cx', '0');
        circle.setAttribute('cy', '0');

        // Body shape (different per gender)
        const body = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        if (player === 1) {
            // Male: Broad shoulders/body shape
            body.setAttribute('d', 'M-22,22 Q-28,40 -18,55 L18,55 Q28,40 22,22 Z');
        } else {
            // Female: Dress/skirt shape
            body.setAttribute('d', 'M-16,22 Q-32,50 -22,60 L22,60 Q32,50 16,22 Z');
        }

        // Icon/emoji inside
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.textContent = player === 1 ? '💙' : '💗';
        text.setAttribute('x', '0');
        text.setAttribute('y', '8');

        group.appendChild(circle);
        group.appendChild(body);
        group.appendChild(text);

        return group;
    }

    /**
     * Update player position on board - uses stored tile centers for perfect centering
     */
    updatePlayerPosition(player, tileIndex) {
        const marker = player === 1 ? this.playerMarkers.p1 : this.playerMarkers.p2;
        const centers = player === 1 ? this.tileCenters.lane1 : this.tileCenters.lane2;

        if (!marker) return;

        // Clamp index
        const index = Math.min(Math.max(0, tileIndex), this.tilesPerLane - 1);

        // Use stored tile center for exact positioning
        let pos;
        if (centers && centers[index]) {
            pos = centers[index];
        } else if (this.INTERSECTIONS[index]) {
            pos = this.INTERSECTIONS[index];
        } else {
            // Fallback to path position
            const path = player === 1 ? this.lane1Path : this.lane2Path;
            const percentage = this.tilePositions[index] || 0;
            pos = this.getPointOnPath(path, percentage);
        }

        // Player centered exactly on tile center
        marker.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);
    }

    /**
     * Highlight current player's tile
     */
    highlightTile(player, tileIndex) {
        // Remove previous highlights
        document.querySelectorAll('.tile-current').forEach(el => {
            el.classList.remove('tile-current');
        });

        // Add highlight
        const lane = player === 1 ? 'lane1' : 'lane2';
        const tile = this.tiles[lane][tileIndex];
        if (tile) {
            tile.querySelector('.tile-bg').classList.add('tile-current');
        }
    }

    /**
     * Animate player movement along lane path
     */
    async animatePlayerMovement(player, fromIndex, toIndex, duration = 200) {
        const path = player === 1 ? this.lane1Path : this.lane2Path;
        const marker = player === 1 ? this.playerMarkers.p1 : this.playerMarkers.p2;

        const steps = Math.abs(toIndex - fromIndex);
        if (steps === 0) return;

        const stepDuration = Math.max(duration / steps, 50); // Min 50ms per step for snappiness

        for (let i = fromIndex + 1; i <= toIndex; i++) {
            // Use stored tile center for exact positioning
            const centers = player === 1 ? this.tileCenters.lane1 : this.tileCenters.lane2;
            let pos;
            if (centers && centers[i]) {
                pos = centers[i];
            } else if (this.INTERSECTIONS[i]) {
                pos = this.INTERSECTIONS[i];
            } else {
                const percentage = this.tilePositions[i];
                pos = this.getPointOnPath(path, percentage);
            }

            // Player centered on tile exactly
            marker.setAttribute('transform', `translate(${pos.x}, ${pos.y})`);

            // Highlight tile briefly
            this.highlightTile(player, i);

            await this.sleep(stepDuration);
        }
    }

    /**
     * Get tile type at position (uses stored types for consistency)
     */
    getTileType(player, index) {
        const types = player === 1 ? this.currentTileTypes1 : this.currentTileTypes2;
        return types ? types[index] : 'romance';
    }

    /**
     * Check if tile is overlap
     */
    isOverlapTile(index) {
        return this.intersectionIndices.includes(index);
    }

    /**
     * Sleep helper
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Export
window.BoardRenderer = BoardRenderer;
