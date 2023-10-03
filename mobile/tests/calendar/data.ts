import getDaysOfWeek from "../../utils/getDaysOfWeek"

export type WeekWorkouts = {
    weekDay: number
    date: Date
    workout: Workout
}

export type Workout = {
    name: string
    exercises: Exercise[]
    dayOff: boolean
}

export type Exercise = {
    name: string
    muscleId: string
    weight: number
    reps: number
    series: number
    PR: number // Personal Record
}

const date = getDaysOfWeek()

let workouts: Workout[] = [
    {
        name: 'Quads e Gluteos',
        exercises: [
            { name: 'Legpress', muscleId: 'quadricpes', weight: 180, PR: 200, reps: 8, series: 3 },
            { name: 'Agachamento', muscleId: 'quadricpes', weight: 55, PR: 60, reps: 8, series: 3 },
            { name: 'Cadeira Extensora', muscleId: 'quadricpes', weight: 75, PR: 75, reps: 8, series: 3 },
            { name: 'Cadeira Abdutora', muscleId: 'gluteos', weight: 75, PR: 75, reps: 8, series: 3 },
            { name: 'Levantamento Terra', muscleId: 'quadricpes hamstrings gluteos', weight: 85, PR: 100, reps: 8, series: 3 },
        ],
        dayOff: false
    },
    {
        name: 'Peito e Tricpes',
        exercises: [
            { name: 'CrossOver na Máquina', muscleId: 'chest', weight: 59, PR: 62, reps: 10, series: 3 },
            { name: 'Supino Reto com Halteres', muscleId: 'chest', weight: 17.5, PR: 17.5, reps: 10, series: 3 },
            { name: 'Supino Inclinado na Máquina', muscleId: 'chest', weight: 15, PR: 20, reps: 10, series: 3 },
            { name: 'CrossOver Polia Alta', muscleId: 'chest', weight: 9.1, PR: 11, reps: 10, series: 3 },
            { name: 'Tricpes Corda', muscleId: 'tricpes', weight: 41, PR: 41, reps: 10, series: 3 },
            { name: 'Tricpes Testa', muscleId: 'tricpes', weight: 37, PR: 37, reps: 10, series: 3 },
            { name: 'Tricpes Francês', muscleId: 'tricpes', weight: 6, PR: 6, reps: 10, series: 3 },
        ],
        dayOff: false
    },
    {
        name: 'Costas e Ombro',
        exercises: [
            { name: 'Remada Curvada', muscleId: 'upperback', weight: 45, PR: 47, reps: 10, series: 3 },
            { name: 'Puxada Alta', muscleId: 'lowerback', weight: 52, PR: 52, reps: 10, series: 3 },
            { name: 'Remada Baixa', muscleId: 'middleback', weight: 47, PR: 47, reps: 10, series: 3 },
            { name: 'Remada Serrote', muscleId: 'lowerback', weight: 25, PR: 25, reps: 10, series: 3 },
            { name: 'Desenvolvimento na Máquina', muscleId: 'anterior deltoid', weight: 12.5, PR: 15, reps: 10, series: 3 },
            { name: 'Elevação Lateral', muscleId: 'side deltoid', weight: 7.5, PR: 10, reps: 10, series: 3 },
            { name: 'Posterior na polia', muscleId: 'tricpes', weight: 2.1, PR: 4.5, reps: 10, series: 3 },
        ],
        dayOff: false
    },
    {
        name: 'Bicpes e Antebraço',
        exercises: [
            { name: 'Rosca direta', muscleId: 'bicpes', weight: 12.5, PR: 15, reps: 10, series: 3 },
            { name: 'Rosca Scott', muscleId: 'bicpes', weight: 34, PR: 34, reps: 10, series: 3 },
            { name: 'Rosca 45', muscleId: 'bicpes', weight: 14, PR: 18, reps: 10, series: 3 },
            { name: 'Rosca Martelo', muscleId: 'bicpes', weight: 23, PR: 25, reps: 10, series: 3 },
            { name: 'Flexão de punho', muscleId: 'anterior deltoid', weight: 32, PR: 32, reps: 10, series: 3 }
        ],
        dayOff: false
    },
    {
        name: 'Posterior e panturrilha',
        exercises: [
            { name: 'Mesa flexora', muscleId: 'posterior', weight: 45, PR: 47, reps: 10, series: 3 },
            { name: 'Cadeira Flexora', muscleId: 'posterior', weight: 52, PR: 52, reps: 10, series: 3 },
            { name: 'Stiff', muscleId: 'posterior', weight: 47, PR: 47, reps: 10, series: 3 },
            { name: 'Levantamento Terra', muscleId: 'all-leg', weight: 25, PR: 25, reps: 10, series: 3 },
            { name: 'Panturrilha no Legpress', muscleId: 'panturrilha', weight: 180, PR: 200, reps: 10, series: 3 },
            { name: 'Panturrilha na Maquina', muscleId: 'panturrilha', weight: 100, PR: 100, reps: 10, series: 3 }
        ],
        dayOff: false
    },
    {
        name: 'Descanso',
        exercises: [],
        dayOff: true
    },
]
let workoutData: WeekWorkouts[] = []

for(let i of date) {

    function getWorkout(): Workout {
        const itsDayOff = i.weekDayId === 6 || i.weekDayId === 0 
        const dayOff = workouts.find((w) => w.dayOff)
        const randomWorkout = workouts.filter((w) => w.dayOff === false)[itsDayOff ? 1 : i.weekDayId-1]

        return itsDayOff ? dayOff! : randomWorkout
    }


    workoutData.push({
        date: i.date,
        weekDay: i.weekDayId,
        workout: getWorkout()
    })
}

export default workoutData