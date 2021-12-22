import axios from 'axios'
import type { NextPage } from 'next'
import { AppContext } from 'next/app'
import Image from 'next/image'
import { useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'
import cn from 'classnames'

import { getImagesByTraits, ImagesByTrait, TraitOption } from '../api/getImagesByTraits'
import Modal, { useModal } from '../components/Modal'
import { API_URL } from '../config'
import { sectionTitle } from '../components/Titles'

function getFilename(trait: string, option: string): string {
  return `/traits/${trait}-${option.replace(" ", "-")}.svg`.toLowerCase()
}

const Traits: NextPage<{ traits: ImagesByTrait[] }> = ({ traits }) => {
  const [modalOpen, {openModal, closeModal}] = useModal()
  const [selected, setSelected] = useState<null | TraitOption>(null)

  useUpdateEffect(() => {
    if (selected) openModal()
  }, [selected])

  useUpdateEffect(() => {
    if (!modalOpen) setSelected(null)
  }, [modalOpen])
  
  return (
    <>
      {traits.map(trait => (
        <section key={trait.name} className="px-6 max-w-7xl mx-auto my-8 sm:my-12 md:my-16">
          <h2 className={cn(sectionTitle, "my-4")}>
            {trait.name}
          </h2>

          <ul className="flex flex-wrap mb-6 -mx-1">
            {trait.options.map(option => (
              <li 
                key={trait.name + "-" + option.name} 
                className="block w-1/2 sm:w-1/3 md:w-1/6 px-1 mb-4 cursor-pointer hover:text-purple-300"
                role="button"
                onClick={() => setSelected(option)}
              >
                <div className="relative square m-auto w-full overflow-hidden rounded-lg">
                  <Image 
                    src={getFilename(trait.name, option.name)} 
                    alt={trait.name + " - " + option.name} 
                    layout="fill" 
                  />
                </div>
                <span className="font-mono text-sm">
                  {option.name} ({option.rarity.toFixed(2) + "%"})
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {selected && (
        <Modal 
          title={selected.name + " (" + selected.rarity.toFixed(2) + "%)"}
          open={modalOpen} 
          content={(
            <div style={{ maxWidth: 500 }} className="relative square m-auto w-full overflow-hidden rounded-lg">
              <Image 
                quality={90} 
                src={getFilename(selected.traitName, selected.name)} 
                alt={"SpaceDicks"} 
                layout="fill" 
              />
            </div>
          )} 
          onClose={closeModal}
        />
      )}
    </>
  )
}

export default Traits

// Fetch images for API only on build
// will be passed to the page component as props
export async function getStaticProps(context: AppContext) {
  try {
    const allTraits = await axios.get(API_URL + "/stats")
    return {
      props: {
        traits: getImagesByTraits(allTraits.data)
      }, 
    }
  } catch (error) {
    throw new Error("Could not fetch api/stats")
  }
}
