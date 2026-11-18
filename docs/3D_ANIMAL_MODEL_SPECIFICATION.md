# Technical 3D Character Asset Specification (GLB / GLTF)
**Target Platform:** Every Child Reads - WebGL / Three.js (@react-three/fiber)  
**Characters:** Tiggy (Tiger), Mimi (Cat), Piku (Parrot)

---

## 1. File Format & Polycount Constraints
- **Format:** Binary glTF (`.glb`) with embedded Draco or KHR_meshopt compression.
- **Target Polycount:** 18,000 to 32,000 triangles (optimized for low-end mobile & school Chromebooks).
- **Draw Calls:** Maximum 3-5 draw calls per character (combine clothing, accessories, and body materials where possible).
- **Texture Maps:** 2K (2048x2048) PBR Texture set:
  - BaseColor (Albedo) with baked ambient occlusion
  - Normal Map (DirectX/OpenGL tangent space)
  - Roughness / Metallic / AO (Packed ORM texture: Red = Occlusion, Green = Roughness, Blue = Metallic)

---

## 2. Skeletal Rigging Hierarchy (Humanoid Standard)
Characters must follow standard humanoid bone naming conventions so animation clips can be shared and retargeted:
- `Root`
  - `Hips`
    - `Spine` -> `Spine1` -> `Chest` -> `Neck` -> `Head`
      - `LeftShoulder` -> `LeftArm` -> `LeftForeArm` -> `LeftHand` (3-4 fingers)
      - `RightShoulder` -> `RightArm` -> `RightForeArm` -> `RightHand` (3-4 fingers)
      - `Jaw` (Articulated jaw bone for secondary speech dynamics)
    - `LeftUpLeg` -> `LeftLeg` -> `LeftFoot` -> `LeftToeBase`
    - `RightUpLeg` -> `RightLeg` -> `RightFoot` -> `RightToeBase`
    - `Tail_01` -> `Tail_02` -> `Tail_03` -> `Tail_04` (For Tiggy & Mimi wagging animations)

---

## 3. Mandatory Facial Blendshapes (Morph Targets for Telugu Lip-Sync)
The `Head` mesh MUST contain the following morph targets (values 0.0 to 1.0):

| Blendshape Name | Description | Telugu Speech / Viseme Usage |
|---|---|---|
| `jawOpen` | Lower jaw drops vertically | Core vowel sounds: **ఆ (aa), అ (a), ఏ (ae)** |
| `mouthWide` | Mouth corners pull horizontally | High vowels: **ఇ (i), ఈ (ee)** |
| `mouthPucker` | Lips push forward into an 'O' ring | Round vowels: **ఉ (u), ఊ (oo), ఓ (o)** |
| `mouthFunnel` | Open funnel shape | Conjunct plosives: **ప (pa), భ (bha), మ (ma)** |
| `mouthSmile` | Gentle friendly upward smile | Default idle friendly teacher expression |
| `blinkLeft` | Left eyelid closes fully | Autonomous natural blinking (every 3-5s) |
| `blinkRight` | Right eyelid closes fully | Autonomous natural blinking (every 3-5s) |
| `browRaise` | Both eyebrows lift up | Excited teaching / questioning: *"బాగా చెప్పారు!"* |

*Note for Piku (Parrot):*
Replace `jawOpen` with `beakLowerDown` and `beakUpperRaise` for articulated beak movements.

---

## 4. Required Animation Clips (Baked in GLB)
1. `Idle_Breathing` (Loop, 3.0s): Gentle chest breathing, tail swaying, subtle ear twitch.
2. `Teaching_Gesture` (Loop, 4.0s): Right hand points toward blackboard, head nods encouragingly.
3. `Listening_Pose` (Loop, 2.5s): Head tilted slightly, hands placed forward, attentive ears.
4. `Praise_Celebration` (One-shot, 2.0s): Both paws in the air, joyous smile, tail wagging excitedly.
